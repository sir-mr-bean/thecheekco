import { createRouter } from "@/backend/createRouter";
import superjson from "superjson";
import { ApiResponse, Client, CreateOrderResponse, Environment } from "square";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { quantityRatioSchema } from "square/dist/models/quantityRatio";

const { ordersApi, customersApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production,
});

export const squareOrderRouter = createRouter()
  .transformer(superjson)
  .mutation("create-delivery-order", {
    input: z.object({
      shippingTotal: z.string(),
      lineItems: z.array(
        z.object({
          name: z.string().optional().nullable(),
          catalogObjectId: z.string(),
          quantity: z.number(),
          modifiers: z.array(
            z.object({
              name: z.string(),
              catalogObjectId: z.string(),
              basePriceMoney: z
                .object({
                  amount: z.bigint().nullable().optional(),
                  currency: z.string().nullable().optional(),
                })
                .nullable()
                .optional(),
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
        companyName: z.string().nullable().optional(),
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
        companyName: z.string().nullable().optional(),
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
      const {
        lineItems,
        referenceId,
        billingAddress,
        shippingAddress,
        shippingTotal,
      } = input;
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
          companyName: billingAddress.companyName || "",
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
        try {
          await customersApi.updateCustomer(customerId as string, {
            address: {
              addressLine1: billingAddress.addressLine1,
              addressLine2: billingAddress?.addressLine2 || "",
              administrativeDistrictLevel1: billingAddress.region,
              locality: billingAddress.locality,
              postalCode: billingAddress.postalCode,
              country: billingAddress.country,
            },
            companyName: billingAddress.companyName || "",
            givenName: billingAddress.firstName,
            familyName: billingAddress.lastName,
            emailAddress: billingAddress.email,
            phoneNumber: billingAddress.phoneNumber,
          });
        } catch (e) {
          console.log(e);
        }
      }

      const orderItems = lineItems.map(
        ({ catalogObjectId, quantity, name, modifiers }) => {
          if (name) {
            return {
              quantity: quantity.toString(),
              name: name,
              basePriceMoney: {
                amount: BigInt(
                  parseInt(parseFloat(shippingTotal.toString()).toString())
                ),
                currencyCode: "AUD",
              },
            };
          } else {
            return {
              catalogObjectId: catalogObjectId as string,
              quantity: quantity.toString(),
            };
          }
        }
      );
      const order: ApiResponse<CreateOrderResponse> =
        await ordersApi.createOrder({
          idempotencyKey: randomUUID(),
          order: {
            locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
            referenceId: referenceId.substring(0, 39),
            customerId: customerId,
            lineItems: lineItems.map(
              ({ catalogObjectId, quantity, name, modifiers }) => {
                if (modifiers?.[0].basePriceMoney) {
                  return {
                    quantity: quantity.toString(),
                    name: modifiers?.[0].name as string,
                    basePriceMoney: {
                      amount: modifiers[0].basePriceMoney.amount as bigint,
                      currency: "AUD" as string,
                    },
                  };
                } else {
                  return {
                    catalogObjectId: catalogObjectId as string,
                    quantity: quantity.toString(),
                  };
                }
              }
            ),
            fulfillments: [
              {
                shipmentDetails: {
                  carrier: "Australia Post",
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
  .mutation("create-pickup-order", {
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
      pickupCustomer: z.object({
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
      }),
    }),
    async resolve({ input, ctx }) {
      const { lineItems, referenceId, pickupCustomer } = input;
      const customer = await customersApi.listCustomers();
      let customerId: string | undefined;
      const existingCustomer = customer?.result?.customers?.find(
        (customer) => customer.emailAddress === pickupCustomer.email
      );
      if (!existingCustomer) {
        const newCustomer = await customersApi.createCustomer({
          givenName: pickupCustomer.firstName,
          familyName: pickupCustomer.lastName,
          emailAddress: pickupCustomer.email,
          phoneNumber: pickupCustomer.phoneNumber,
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
        const order: ApiResponse<CreateOrderResponse> =
          await ordersApi.createOrder({
            idempotencyKey: randomUUID(),
            order: {
              locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
              referenceId: referenceId.substring(0, 39),
              customerId: customerId,
              lineItems: lineItems.map(({ catalogObjectId, quantity }) => ({
                catalogObjectId,
                quantity: quantity.toString(),
              })),
              fulfillments: [
                {
                  pickupDetails: {
                    recipient: {
                      customerId: customerId,
                    },
                    scheduleType: "ASAP",
                    prepTimeDuration: "P2DT12H30M",
                  },
                  state: "PROPOSED",
                  type: "PICKUP",
                },
              ],
            },
          });

        const orderResult = order?.result?.order;
        return orderResult;
      }
    },
  })
  .mutation("update-order", {
    input: z.object({
      orderId: z.string(),
      state: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { orderId, state } = input;
      const updateOrder = await ordersApi.updateOrder(orderId, {
        order: {
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
          state: state,
        },
        idempotencyKey: randomUUID(),
      });

      const orderResult = updateOrder?.result?.order;
      return orderResult;
    },
  })
  .query("get-order", {
    input: z.object({
      orderId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { orderId } = input;
      try {
        const getOrder = await ordersApi.retrieveOrder(orderId);
        const orderResult = getOrder?.result?.order;
        return orderResult;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  })
  .query("get-order-ids", {
    input: z.object({
      customerId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { customerId } = input;
      try {
        const ordersQuery = await ordersApi.searchOrders({
          locationIds: [process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string],
          query: {
            filter: {
              customerFilter: {
                customerIds: [customerId],
              },
            },
          },
        });
        return ordersQuery?.result?.orders;
      } catch (error) {
        console.log("Failed to fetch order!");
        return [];
      }
    },
  })
  .query("get-orders-by-ids", {
    input: z.object({
      orderIds: z.array(z.string()),
    }),
    async resolve({ input, ctx }) {
      const { orderIds } = input;
      const getOrders = await ordersApi.batchRetrieveOrders({
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
        orderIds: orderIds.map((order) => order),
      });
      const orderResult = getOrders?.result?.orders;
      return orderResult;
    },
  });
