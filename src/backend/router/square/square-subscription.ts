import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import { Client, Environment } from "square";
import { getSession } from "next-auth/react";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

const { subscriptionsApi, customersApi, paymentsApi, catalogApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareCategoriesRouter = createRouter()
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
  .mutation("create-subscription", {
    input: z.object({
      customerId: z.string(),
      subscriptionPlanId: z.string(),
      cardId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { customerId, subscriptionPlanId } = input;
      const { req } = ctx;
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
      const createSubscription = await subscriptionsApi.createSubscription({
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
        planId: subscriptionPlanId,
        customerId: customerId,
        cardId: input.cardId,
        timezone: "Australia/Brisbane",
      });
      return createSubscription?.result;
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
