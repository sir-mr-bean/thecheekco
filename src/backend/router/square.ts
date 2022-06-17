import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import {
  ApiResponse,
  Client,
  CreateOrderResponse,
  Environment,
  Order,
  OrderCreated,
} from "square";
import { randomUUID } from "crypto";
import { z } from "zod";
import getConfig from "next/config";
import { CategoryType } from "@/types/Product";
import { Category } from "@/types/Category";
import { OrderItem } from "@prisma/client";
const { serverRuntimeConfig } = getConfig();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const { ordersApi, paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareRouter = createRouter()
  .mutation("createOrder", {
    input: z.object({
      lineItems: z.array(
        z.object({
          catalogObjectId: z.string(),
          quantity: z.number(),
          modifiers: z.array(
            z.object({
              name: z.string(),
              catalogObjectId: z.string(),
            })
          ),
        })
      ),
      referenceId: z.string(),
      billingAddress: z.object({
        email: z.string(),
        displayName: z.string(),
        companyName: z.string(),
        phoneNumber: z.string(),
        addressLine1: z.string(),
        addressLine2: z.string().nullish(),
        locality: z.string(),
        region: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
      shippingAddress: z.object({
        email: z.string(),
        displayName: z.string(),
        companyName: z.string(),
        phoneNumber: z.string(),
        addressLine1: z.string(),
        addressLine2: z.string().nullish(),
        locality: z.string(),
        region: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
    }),
    async resolve({ input, ctx }) {
      const { lineItems, referenceId, billingAddress, shippingAddress } = input;

      const order: ApiResponse<CreateOrderResponse> =
        await ordersApi.createOrder({
          idempotencyKey: randomUUID(),
          order: {
            locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
            referenceId: referenceId,

            lineItems: lineItems.map(({ catalogObjectId, quantity }) => ({
              catalogObjectId,
              quantity: quantity.toString(),
            })),
            fulfillments: [
              {
                shipmentDetails: {
                  carrier: "Australia Post",
                  expectedShippedAt: "2022-06-15",
                  recipient: {
                    address: {
                      country: "AU",
                      postalCode: shippingAddress.postalCode,
                      addressLine1: shippingAddress.addressLine1,
                      addressLine2: shippingAddress?.addressLine2 || "",
                      locality: shippingAddress.region,
                    },
                    displayName: shippingAddress.displayName,
                    emailAddress: shippingAddress.email,
                    phoneNumber: shippingAddress.phoneNumber,
                  },
                },
                state: "PROPOSED",
                type: "SHIPMENT",
              },
            ],
          },
        });
      console.log(order);
      const orderResult = order?.result?.order;
      return orderResult;
    },
  })
  .mutation("createOrderPayment", {
    input: z.object({
      orderId: z.string(),
      totalMoney: z.string(),
      token: z.string(),
    }),
    async resolve({ input, ctx }) {
      console.log("creating payment");
      console.log(input);
      const { orderId, totalMoney, token } = input;
      const totalPayment = BigInt(totalMoney);
      const payment = await paymentsApi.createPayment({
        idempotencyKey: randomUUID(),
        sourceId: token,
        amountMoney: {
          currency: "AUD",
          amount: totalPayment,
        },
        orderId: orderId,
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
        autocomplete: false,
      });
      console.log(payment);
      const paymentResult = payment?.result?.payment;
      return paymentResult;
    },
  })
  .mutation("completeOrderPayment", {
    input: z.object({
      orderId: z.string(),
      paymentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const prisma = ctx.prisma;
      console.log("completing order");
      console.log(input);
      const { orderId, paymentId } = input;
      const payOrder = await ordersApi.payOrder(orderId, {
        idempotencyKey: randomUUID(),
        paymentIds: [paymentId],
      });
      console.log(payOrder);
      const orderResult = payOrder?.result?.order;
      // push order to prisma
      if (
        orderResult?.lineItems &&
        orderResult?.fulfillments?.[0]?.shipmentDetails?.recipient
      ) {
        const orderCreated = await prisma.order.create({
          data: {
            id: orderResult?.id as string,

            lineItems: {
              createMany: {
                data: orderResult.lineItems.map((item) => ({
                  id: randomUUID(),
                  productId: item.catalogObjectId as string,
                  quantity: parseInt(item.quantity) as number,
                })),
              },
            },
            user: {
              connect: {
                email:
                  orderResult?.fulfillments?.[0]?.shipmentDetails?.recipient
                    ?.emailAddress,
              },
            },
          },
        });

        return { orderResult, orderCreated };
      }
    },
  })
  .mutation("updateOrder", {
    input: z.object({
      orderId: z.string(),
      state: z.string(),
    }),
    async resolve({ input, ctx }) {
      console.log("updating order");
      console.log(input);
      const { orderId, state } = input;
      const updateOrder = await ordersApi.updateOrder(orderId, {
        order: {
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
          state: state,
        },
        idempotencyKey: randomUUID(),
      });
      console.log(updateOrder);
      const orderResult = updateOrder?.result?.order;
      return orderResult;
    },
  })
  .query("getOrder", {
    input: z.object({
      orderId: z.string(),
    }),
    async resolve({ input, ctx }) {
      console.log("getting order");
      console.log(input);
      const { orderId } = input;
      const getOrder = await ordersApi.retrieveOrder(orderId);
      console.log(getOrder);
      const orderResult = getOrder?.result?.order;
      return orderResult;
    },
  })

  .query("categories", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    async resolve() {
      const categories: Category[] = [];
      console.log("fetching categories");
      try {
        let sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category`;
        let cursor = null;
        do {
          if (cursor != null)
            sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category&cursor=${cursor}`;
          console.log(sqCategories);
          const res = await fetch(sqCategories, {
            headers: {
              "Square-Version": "2022-05-12",
              "Content-Type": "application/json",
              Authorization: `Bearer ${serverRuntimeConfig.squareAccessToken}`,
            },
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch categories from Square, received status ${res.status}`
            );
          }
          const data = await res.json();
          //console.log(data);
          //console.log(data);
          categories.push(...(data?.objects as never[]));
          cursor = data.cursor;
        } while (cursor != "" && cursor != null);
      } catch (e) {
        console.log(e);
        throw new TRPCError(e.message);
      }
      console.log(categories);
      return categories;
    },
  })
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  });
