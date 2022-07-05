import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";

import {
  ApiResponse,
  CatalogObject,
  Client,
  CreateOrderResponse,
  Environment,
} from "square";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const { ordersApi, paymentsApi, cardsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squarePaymentRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next }) => {
    // Any query or mutation after this middleware will raise
    // an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({
        message: "You are not authorized to perform this action",
        code: "UNAUTHORIZED",
      });
    }
    return next();
  })
  .mutation("create-order-payment", {
    input: z.object({
      orderId: z.string(),
      totalMoney: z.string(),
      token: z.string(),
      customerId: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const { orderId, totalMoney, token } = input;
      const totalPayment = BigInt(totalMoney);
      const payment = await paymentsApi.createPayment({
        idempotencyKey: randomUUID(),
        customerId: input.customerId ? (input.customerId as string) : undefined,
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
  .mutation("complete-order-payment", {
    input: z.object({
      orderId: z.string(),
      paymentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const prisma = ctx.prisma;

      const { orderId, paymentId } = input;
      const payOrder = await ordersApi.payOrder(orderId, {
        idempotencyKey: randomUUID(),
        paymentIds: [paymentId],
      });
      const orderResult = payOrder?.result?.order;
      if (
        orderResult?.lineItems &&
        (orderResult?.fulfillments?.[0]?.shipmentDetails?.recipient ||
          orderResult?.fulfillments?.[0].pickupDetails?.recipient)
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
                    ?.emailAddress ||
                  orderResult?.fulfillments?.[0].pickupDetails?.recipient
                    ?.emailAddress,
              },
            },
          },
        });

        return { orderResult, orderCreated };
      }
    },
  })
  .query("get-customer-payment-methods", {
    input: z.object({
      customerId: z.string(),
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (input.email !== ctx.session?.user.email) {
        throw new TRPCError({
          message: "You are not authorized to perform this action",
          code: "UNAUTHORIZED",
        });
      }
      const { customerId } = input;
      const getCustomerPaymentMethods = await cardsApi.listCards(
        undefined,
        customerId
      );
      const customerPaymentMethods = getCustomerPaymentMethods?.result?.cards;
      return customerPaymentMethods;
    },
  })
  .mutation("create-customer-payment-method", {
    input: z.object({
      customerId: z.string(),
      token: z.object({
        cardNonce: z.string(),
        cardDetails: z.object({
          billingAddress: z.object({
            addressLine1: z.string(),
            addressLine2: z.string(),
            locality: z.string(),
            postalCode: z.string(),
            country: z.string(),
          }),
          expMonth: z.number(),
          expYear: z.number(),
          holderName: z.string(),
        }),
      }),
    }),
    async resolve({ input, ctx }) {
      const { customerId, token } = input;
      const createCustomerPaymentMethod = await cardsApi.createCard({
        idempotencyKey: randomUUID(),
        sourceId: token.cardNonce,
        card: {
          billingAddress: {
            addressLine1: token.cardDetails.billingAddress.addressLine1,
            addressLine2: token.cardDetails.billingAddress.addressLine2,
            locality: token.cardDetails.billingAddress.locality,
            postalCode: token.cardDetails.billingAddress.postalCode,
            country: token.cardDetails.billingAddress.country,
          },
          cardholderName: token.cardDetails.holderName,
          expMonth: BigInt(token.cardDetails.expMonth),
          expYear: BigInt(token.cardDetails.expYear),
          customerId: customerId,
        },
      });
      const customerPaymentMethod = createCustomerPaymentMethod?.result?.card;
      return customerPaymentMethod;
    },
  })
  .mutation("delete-customer-payment-method", {
    input: z.object({
      paymentMethodId: z.string(),
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (input.email !== ctx.session?.user.email) {
        throw new TRPCError({
          message: "You are not authorized to perform this action",
          code: "UNAUTHORIZED",
        });
      }
      const { paymentMethodId } = input;
      const deleteCustomerPaymentMethod = await cardsApi.disableCard(
        paymentMethodId
      );
      const customerPaymentMethod = deleteCustomerPaymentMethod?.result?.card;
      return customerPaymentMethod;
    },
  });
