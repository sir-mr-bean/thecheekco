import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import {
  ApiResponse,
  CatalogItem,
  CatalogProductSet,
  Client,
  CreateOrderResponse,
  Environment,
  ListCustomersResponse,
  Order,
  OrderCreated,
} from "square";
import { randomUUID } from "crypto";
import { z } from "zod";
import getConfig from "next/config";
import { CategoryType, Product, Category } from "@/types/Product";

import { bigint, unknown } from "square/dist/schema";
const { serverRuntimeConfig } = getConfig();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const { ordersApi, paymentsApi, customersApi } = new Client({
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
        firstName: z.string(),
        lastName: z.string(),
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
        firstName: z.string(),
        lastName: z.string(),
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
      // check if customer exists in square, if not create one
      const customer = await customersApi.listCustomers();
      let customerId: string | undefined;
      const existingCustomer = customer?.result?.customers?.find(
        (customer) => customer.emailAddress === billingAddress.email
      );
      if (!existingCustomer) {
        const newCustomer = await customersApi.createCustomer({
          address: {
            addressLine1: billingAddress.addressLine1,
            addressLine2: billingAddress.addressLine2 as string,
            administrativeDistrictLevel1: billingAddress.region,
            locality: billingAddress.locality,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
          },
          companyName: billingAddress.companyName,
          givenName: billingAddress.firstName,
          familyName: billingAddress.lastName,
          emailAddress: billingAddress.email,
          phoneNumber: billingAddress.phoneNumber,
        });
        customerId = newCustomer?.result?.customer?.id;
        if (!customerId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to create customer",
          });
        }
      } else {
        customerId = existingCustomer?.id;
        const updatedUser = await customersApi.updateCustomer(
          customerId as string,
          {
            address: {
              addressLine1: billingAddress.addressLine1,
              addressLine2: billingAddress.addressLine2 as string,
              administrativeDistrictLevel1: billingAddress.region,
              locality: billingAddress.locality,
              postalCode: billingAddress.postalCode,
              country: billingAddress.country,
            },
            companyName: billingAddress.companyName,
            givenName: billingAddress.firstName,
            familyName: billingAddress.lastName,
            emailAddress: billingAddress.email,
            phoneNumber: billingAddress.phoneNumber,
          }
        );
      }

      const order: ApiResponse<CreateOrderResponse> =
        await ordersApi.createOrder({
          idempotencyKey: randomUUID(),
          order: {
            locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
            referenceId: referenceId,
            customerId: customerId,
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
  .query("getOrders", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      console.log("getting orders");
      console.log(input);
      const { email } = input;
      const prisma = ctx.prisma;
      const orders = await prisma.order.findMany({
        where: {
          user: {
            email,
          },
        },
      });
      if (orders?.length) {
        const getOrders = await ordersApi.batchRetrieveOrders({
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
          orderIds: orders.map((order) => order.id),
        });
        console.log(getOrders);
        const orderResult = getOrders?.result?.orders;
        return orderResult;
      }
    },
  })
  .query("categories", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    async resolve() {
      const categoriesArray: Category[] = [];
      console.log("fetching categories");
      try {
        let sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category`;

        let cursor = null;
        do {
          if (cursor != null)
            sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category&cursor=${cursor}`;
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
          categoriesArray.push(...(data.objects as never[]));
          cursor = data.cursor;
        } while (cursor != "" && cursor != null);
      } catch (e) {
        console.log(e);
        throw new TRPCError(e.message);
      }
      const categoriesResponse = categoriesArray.filter(
        (category) => !category.category_data.name.startsWith("_")
      );
      return categoriesResponse;
    },
  })
  .query("products", {
    input: z
      .object({
        categoryId: z.string().nullish(),
        text: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input, ctx }) {
      console.log("fetching products");
      const productArray: Product[] = [];
      try {
        let sqProducts = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/search`;
        let cursor = null;
        do {
          if (cursor != null)
            sqProducts = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/search?cursor=${cursor}`;
          const res = await fetch(sqProducts, {
            method: "POST",
            headers: {
              "User-Agent": "*",
              "Square-Version": "2022-05-12",
              "Content-Type": "application/json",
              Authorization: `Bearer ${serverRuntimeConfig.squareAccessToken}`,
            },
            body: JSON.stringify({
              include_related_objects: true,
              object_types: ["ITEM"],
            }),
          });
          if (!res.ok) {
            throw new Error(
              `Failed to fetch products from Square, received status ${res.status}`
            );
          }
          const data = await res.json();
          console.log("data is ", data);
          const products = data.objects.map((item) => {
            const currentImage = data.related_objects.filter(
              (image) => image.id === item.item_data.image_ids?.[0]
            );
            const currentCategory = data.related_objects.filter(
              (category) => category.id === item.item_data.category_id
            );
            let isAllNatural = false;

            if (item?.item_data.variations?.[0].custom_attribute_values) {
              const keys = Object.keys(
                item?.item_data.variations?.[0].custom_attribute_values
              );
              if (keys.length) {
                const allNaturalAttr = keys?.some((key) => {
                  return (
                    item?.item_data.variations?.[0].custom_attribute_values[key]
                      .name === "All-Natural" &&
                    item?.item_data.variations?.[0].custom_attribute_values[key]
                      .boolean_value === true
                  );
                });
                isAllNatural = allNaturalAttr;
              }
            }
            return {
              id: item.id,
              name: item.item_data.name,
              description: item?.item_data?.description,
              variations: item.item_data.variations,
              image: currentImage?.[0]?.image_data?.url,
              category: currentCategory?.[0],
              isAllNatural: isAllNatural,
            };
          });
          productArray.push(...(products as never[]));
          cursor = data.cursor;
        } while (cursor != "" && cursor != null);

        return productArray;
      } catch (e) {
        console.log(e);
        throw new TRPCError(e.message);
      }
    },
  })
  .query("searchCustomer", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      console.log("searching customer");
      console.log(input);
      const { email } = input;
      const searchCustomer = await customersApi.searchCustomers({
        query: {
          filter: {
            emailAddress: {
              exact: email,
            },
          },
        },
        limit: 1 as unknown as bigint,
      });
      console.log(searchCustomer);
      const customerResult = searchCustomer?.result?.customers?.[0];
      return customerResult;
    },
  })
  .mutation("createCustomer", {
    input: z.object({
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      address: z
        .object({
          addressLine1: z.string(),
          addressLine2: z.string(),
          locality: z.string(),
          region: z.string(),
          postalCode: z.string(),
          country: z.string(),
        })
        .nullable(),
    }),
    async resolve({ input, ctx }) {
      console.log("creating customer");
      console.log(input);
      const { email, firstName, lastName, phoneNumber, address } = input;
      const createCustomer = await customersApi.createCustomer({
        emailAddress: email,
        givenName: firstName,
        familyName: lastName,
        phoneNumber: phoneNumber,
        address: {
          addressLine1: address?.addressLine1,
          addressLine2: address?.addressLine2,
          administrativeDistrictLevel1: address?.region,
          locality: address?.locality,
          country: address?.country,
          postalCode: address?.postalCode,
        },
        idempotencyKey: randomUUID(),
      });
      console.log(createCustomer);
      const customerResult = createCustomer?.result?.customer;
      return customerResult;
    },
  })
  .mutation("updateCustomer", {
    input: z.object({
      customerId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      address: z
        .object({
          addressLine1: z.string(),
          addressLine2: z.string(),
          locality: z.string(),
          region: z.string(),
          postalCode: z.string(),
          country: z.string(),
        })
        .nullable(),
    }),
    async resolve({ input, ctx }) {
      console.log("updating customer");
      console.log(input);
      const { customerId, firstName, lastName, phoneNumber, address } = input;
      const updateCustomer = await customersApi.updateCustomer(customerId, {
        givenName: firstName,
        familyName: lastName,
        phoneNumber: phoneNumber,
        address: {
          addressLine1: address?.addressLine1,
          addressLine2: address?.addressLine2,
          administrativeDistrictLevel1: address?.region,
          locality: address?.locality,
          country: address?.country,
          postalCode: address?.postalCode,
        },
      });
      console.log(updateCustomer);
      const customerResult = updateCustomer?.result?.customer;
      return customerResult;
    },
  });
