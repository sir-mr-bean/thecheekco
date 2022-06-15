import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import { z } from "zod";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const { ordersApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareRouter = createRouter().mutation("createOrder", {
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
    const { prisma } = ctx;
    const order = await ordersApi.createOrder({
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
    return order;
  },
});
