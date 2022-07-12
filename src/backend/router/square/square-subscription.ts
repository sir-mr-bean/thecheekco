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
      return createSubscription.result;
    },
  })
  .query("get-my-subscriptions", {
    async resolve({ ctx }) {
      const { req } = ctx;
      const session = await getSession({ req });
      const customerEmail = session?.user?.email;
      if (!customerEmail) {
        throw new TRPCError({ message: "Not logged in", code: "UNAUTHORIZED" });
      }
      const allCustomers = await customersApi.listCustomers();
      const existingCustomer = allCustomers?.result?.customers?.find(
        (cust) => cust.emailAddress === customerEmail
      );
      if (!existingCustomer) {
        throw new TRPCError({
          message: "No customer found",
          code: "BAD_REQUEST",
        });
      }
      const customerId = existingCustomer.id;
      const subscriptions = await subscriptionsApi.searchSubscriptions({
        query: {
          filter: {
            customerIds: [customerId as string],
            locationIds: [process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string],
          },
        },
        include: ["actions"],
      });
      return subscriptions?.result?.subscriptions;
    },
  })
  .mutation("cancel-subscription", {
    input: z.object({
      subscriptionId: z.string(),
      reason: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const { subscriptionId } = input;
      const session = await getSession({ req });
      const customerEmail = session?.user?.email;
      if (!customerEmail) {
        throw new TRPCError({ message: "Not logged in", code: "UNAUTHORIZED" });
      }
      const allCustomers = await customersApi.listCustomers();
      const existingCustomer = allCustomers?.result?.customers?.find(
        (cust) => cust.emailAddress === customerEmail
      );
      if (!existingCustomer) {
        throw new TRPCError({
          message: "No customer found",
          code: "BAD_REQUEST",
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
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const { subscriptionId } = input;
      const session = await getSession({ req });
      const customerEmail = session?.user?.email;
      if (!customerEmail) {
        throw new TRPCError({ message: "Not logged in", code: "UNAUTHORIZED" });
      }
      const allCustomers = await customersApi.listCustomers();
      const existingCustomer = allCustomers?.result?.customers?.find(
        (cust) => cust.emailAddress === customerEmail
      );
      if (!existingCustomer) {
        throw new TRPCError({
          message: "No customer found",
          code: "BAD_REQUEST",
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
  })
  .mutation("resume-subscription", {
    input: z.object({
      subscriptionId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const { subscriptionId } = input;
      const session = await getSession({ req });
      const customerEmail = session?.user?.email;
      if (!customerEmail) {
        throw new TRPCError({ message: "Not logged in", code: "UNAUTHORIZED" });
      }
      const allCustomers = await customersApi.listCustomers();
      const existingCustomer = allCustomers?.result?.customers?.find(
        (cust) => cust.emailAddress === customerEmail
      );
      if (!existingCustomer) {
        throw new TRPCError({
          message: "No customer found",
          code: "BAD_REQUEST",
        });
      }
      const resumeSubscription = await subscriptionsApi.resumeSubscription(
        subscriptionId,
        {}
      );
      return resumeSubscription?.result;
    },
  });
