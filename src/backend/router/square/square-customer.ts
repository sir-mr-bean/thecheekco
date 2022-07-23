import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSession } from "next-auth/react";

const { customersApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareCustomerRouter = createRouter()
  .transformer(superjson)
  .mutation("create-customer", {
    input: z.object({
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      address: z
        .object({
          addressLine1: z.string(),
          locality: z.string(),
          region: z.string(),
          postalCode: z.string(),
          country: z.string(),
        })
        .nullable(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      const session = await getSession({ req });
      // if session?.user.email !== input?.email) {
      //   throw new TRPCError({
      //     message: "You are not authorized to perform this action",
      //     code: "UNAUTHORIZED",
      //   });
      // }
      const { email, firstName, lastName, phoneNumber, address } = input;
      const createCustomer = await customersApi.createCustomer({
        emailAddress: email,
        givenName: firstName,
        familyName: lastName,
        phoneNumber: phoneNumber,
        address: {
          addressLine1: address?.addressLine1,
          administrativeDistrictLevel1: address?.region,
          locality: address?.locality,
          country: "AU",
          postalCode: address?.postalCode,
        },
        idempotencyKey: randomUUID(),
      });

      const customerResult = createCustomer?.result?.customer;
      return customerResult;
    },
  })
  .mutation("update-customer", {
    input: z.object({
      customerId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      email: z.string(),
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
      const { req } = ctx;
      const session = await getSession({ req });
      if (session?.user.email !== input?.email) {
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
            country: "AU",
            postalCode: address?.postalCode,
          },
        });

        const customerResult = updateCustomer?.result?.customer;
        return customerResult;
      }
    },
  })
  .query("search-customer", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req } = ctx;
      // const session = await getSession({ req });
      // if (session?.user.email !== input?.email) {
      //   throw new TRPCError({
      //     message: "You are not authorized to perform this action",
      //     code: "UNAUTHORIZED",
      //   });
      // }
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

      const customerResult = searchCustomer?.result?.customers?.[0];
      return customerResult;
    },
  });
