import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import {
  ApiResponse,
  Client,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  Environment,
} from "square";
import { getSession } from "next-auth/react";
import * as z from "zod";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

const { subscriptionsApi, customersApi, cardsApi, catalogApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareSubscriptionRouter = createRouter()
  .transformer(superjson)
  .query("get-all-subscriptions", {
    async resolve() {
      const subscriptions = await catalogApi.listCatalog(
        undefined,
        "SUBSCRIPTION_PLAN"
      );
      return subscriptions?.result.objects;
    },
  })
  .mutation("create-subscription", {
    input: z.object({
      token: z
        .object({
          status: z.enum([
            "UNKNOWN",
            "OK",
            "ERROR",
            "INVALID",
            "ABORT",
            "CANCEL",
          ]),
          token: z.string(),
          details: z.object({
            card: z.object({
              brand: z.string(),
              expMonth: z.number(),
              expYear: z.number(),
              last4: z.string(),
            }),
            method: z.string(),
          }),
        })
        .default({
          status: "UNKNOWN",
          token: "",
          details: {
            card: {
              brand: "",
              expMonth: 0,
              expYear: 0,
              last4: "",
            },
            method: "",
          },
        })
        .optional(),
      subscriptionPlanId: z.string(),
      cardId: z.string().optional(),
      customer: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        email: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
      recipient: z.object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string().optional(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postCode: z.string(),
        country: z.literal("Australia"),
      }),
    }),
    async resolve({ input, ctx }) {
      const { subscriptionPlanId, customer, recipient } = input;
      const { req } = ctx;
      const session = await getSession({ req });
      const allCustomers = await customersApi.listCustomers();
      let customerId: string | undefined;
      const existingCustomer = allCustomers?.result?.customers?.find(
        (cust) => cust.emailAddress === customer.email
      );
      if (existingCustomer) {
        customerId = existingCustomer.id;
      }
      if (!customerId) {
        const newCustomer = await customersApi.createCustomer({
          givenName: customer.firstName,
          familyName: customer.lastName,
          companyName: customer.company,
          emailAddress: customer.email,
          phoneNumber: customer.phoneNumber,
          address: {
            addressLine1: customer.address,
            locality: customer.city,
            addressLine2: customer.state,
            postalCode: customer.postCode,
            country: customer.country,
          },
        });
        customerId = newCustomer?.result?.customer?.id;
      }
      if (!customerId) {
        throw new Error("Could not create customer");
      }
      if (!input.cardId) {
        const existingCards = await cardsApi.listCards(undefined, customerId);
        if (existingCards?.result?.cards?.length) {
          input.cardId = existingCards.result.cards.find(
            (card) => card.cardBrand === input.token?.details.card.brand
          )?.id;
        }
      }
      if (!input.cardId) {
        const newCard = await cardsApi.createCard({
          idempotencyKey: randomUUID(),
          sourceId: input.token?.token as string,
          card: {
            customerId: customerId,
          },
        });
        input.cardId = newCard?.result?.card?.id;
      }
      const createSubscription: ApiResponse<CreateSubscriptionResponse> =
        await subscriptionsApi.createSubscription({
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
          planId: subscriptionPlanId,
          customerId: customerId,
          cardId: input.cardId,
          timezone: "Australia/Brisbane",
        });
      console.log(createSubscription);
      return createSubscription.result;
    },
  })
  .mutation("cancel-subscription", {
    input: z.object({
      subscriptionId: z.string(),
      customerId: z.string(),
      reason: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const { subscriptionId } = input;
      const session = await getSession({ req });
      const thisCustomer = await customersApi.retrieveCustomer(
        input.customerId
      );
      if (
        session?.user.email !== thisCustomer?.result?.customer?.emailAddress
      ) {
        throw new TRPCError({
          message: "You are not authorized to perform this action",
          code: "UNAUTHORIZED",
        });
      }
      const cancelSubscription = await subscriptionsApi.cancelSubscription(
        subscriptionId
      );
      //TODO
      //send email to owner with reason
      //send email to customer?
      return cancelSubscription?.result;
    },
  })
  .mutation("pause-subscription", {
    input: z.object({
      subscriptionId: z.string(),
      customerId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const { subscriptionId } = input;
      const session = await getSession({ req });
      const thisCustomer = await customersApi.retrieveCustomer(
        input.customerId
      );
      if (
        session?.user.email !== thisCustomer?.result?.customer?.emailAddress
      ) {
        throw new TRPCError({
          message: "You are not authorized to perform this action",
          code: "UNAUTHORIZED",
        });
      }
      const pauseSubscription = await subscriptionsApi.pauseSubscription(
        subscriptionId,
        {
          pauseReason: "Paused by user",
          pauseCycleDuration: BigInt(1),
        }
      );
      return pauseSubscription?.result;
    },
  });
