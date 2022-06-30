import { TRPCError } from "@trpc/server";
import { createRouter } from "../createRouter";
import {
  ApiResponse,
  CatalogObject,
  Client,
  CreateOrderResponse,
  Environment,
} from "square";
import { randomUUID } from "crypto";
import { z } from "zod";
import getConfig from "next/config";
import superjson from "superjson";
const { serverRuntimeConfig } = getConfig();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const { customersApi, catalogApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareRouter = createRouter()
  .transformer(superjson)

  .query("all-categories", {
    async resolve({ input, ctx }) {
      const categoryQuery = await catalogApi.searchCatalogObjects({
        objectTypes: ["CATEGORY"],
      });
      const categories = categoryQuery.result.objects;
      const categoriesResult = categories?.filter(
        (category) => !category?.categoryData?.name?.startsWith("_")
      );
      return categoriesResult;
    },
  })

  .query("search-customer", {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.email !== input?.email) {
        throw new TRPCError({
          message: "You are not authorized to perform this action",
          code: "UNAUTHORIZED",
        });
      }
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
  })
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
          country: address?.country,
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

      const customerResult = updateCustomer?.result?.customer;
      return customerResult;
    },
  });
