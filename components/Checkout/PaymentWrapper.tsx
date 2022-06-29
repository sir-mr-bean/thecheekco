import { CartState } from "@/context/Cart/Context";
import { CartObject } from "@/types/CartObject";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Dispatch } from "react";
import { PaymentForm } from "react-square-web-payments-sdk";

const PaymentWrapper = ({
  children,
  setOrderProcessing,
  total,
  userObj,
  pickup,
}: {
  children: React.ReactNode;
  setOrderProcessing: Dispatch<boolean>;
  total: number;
  userObj: User;
  pickup: boolean;
}) => {
  const router = useRouter();
  const deliveryOrderMutation = trpc.useMutation([
    "square-order.create-delivery-order",
  ]);
  const pickupOrderMutation = trpc.useMutation([
    "square-order.create-pickup-order",
  ]);
  const paymentMutation = trpc.useMutation([
    "square-payment.create-order-payment",
  ]);
  const completeOrderMutation = trpc.useMutation([
    "square-payment.complete-order-payment",
  ]);
  const updateOrderMutation = trpc.useMutation(["square-order.update-order"]);
  const {
    cart,
    dispatch,
  }: {
    cart: CartObject[];
    dispatch: Dispatch<{
      type: string;
      item?: CartObject;
      quantity?: number;
      productImage?: string;
    }>;
  } = CartState();

  return (
    <PaymentForm
      applicationId={
        process.env.NEXT_PUBLIC_SQUARE_APP_ID
          ? process.env.NEXT_PUBLIC_SQUARE_APP_ID
          : ""
      }
      locationId={
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
          ? process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
          : ""
      }
      createPaymentRequest={() => ({
        countryCode: "AU",
        currencyCode: "AUD",
        displayItems: [
          {
            amount: "22.15",
            label: "Item to be purchased",
            id: "SKU-12345",
            imageUrl: "https://url-cdn.com/123ABC",
            pending: true,
            productUrl: "https://my-company.com/product-123ABC",
          },
        ],
        taxLineItems: [
          {
            label: "State Tax",
            amount: "8.95",
            pending: true,
          },
        ],
        requestBillingContact: false,
        requestShippingContact: false,
        total: {
          amount: total.toString(),
          label: "Total",
        },
      })}
      cardTokenizeResponseReceived={async (token, buyer) => {
        setOrderProcessing(true);
        if (pickup) {
          pickupOrderMutation.mutate(
            {
              pickupCustomer: {
                firstName: userObj.firstName as string,
                lastName: userObj.lastName as string,
                email: userObj.email as string,
                phoneNumber: userObj.phoneNumber as string,
              },
              referenceId: token.token as string,
              lineItems: cart.map((product) => {
                return {
                  catalogObjectId: product.itemData?.variations?.[0]
                    .id as string,
                  quantity: product.quantity,
                  modifiers: [
                    {
                      name: product.itemData?.name as string,
                      catalogObjectId: product.id,
                    },
                  ],
                };
              }),
            },
            {
              onSuccess(data, variables, context) {
                const orderId = data?.id as string;
                const totalMoney =
                  data?.totalMoney?.amount?.toString() as string;

                paymentMutation.mutate(
                  {
                    orderId: orderId,
                    totalMoney: totalMoney,
                    token: token.token as string,
                  },
                  {
                    onSuccess(data, variables, context) {
                      if (data?.status === "APPROVED") {
                        completeOrderMutation.mutate(
                          {
                            orderId: orderId,
                            paymentId: data?.id as string,
                          },
                          {
                            onSuccess(data, variables, context) {
                              setOrderProcessing(false);
                              dispatch({
                                type: "CLEAR_CART",
                              });
                              router.push(`/order/${orderId}?success=true`);
                            },
                          }
                        );
                      }
                    },
                  }
                );
              },
            }
          );
        } else {
          deliveryOrderMutation.mutate(
            {
              lineItems: cart.map((product) => {
                return {
                  catalogObjectId: product.itemData?.variations?.[0]
                    .id as string,
                  quantity: product.quantity,
                  modifiers: [
                    {
                      name: product.itemData?.name as string,
                      catalogObjectId: product.id,
                    },
                  ],
                };
              }),
              referenceId: token.token as string,
              billingAddress: {
                email: userObj.email,
                firstName: userObj.firstName || "",
                lastName: userObj.lastName || "",
                displayName: `${userObj?.firstName} ${userObj.lastName}`,
                companyName: userObj.company as string,
                phoneNumber: userObj.phoneNumber as string,
                addressLine1: userObj.apartmentOrUnit
                  ? `${userObj.apartmentOrUnit} / ${userObj.streetAddress}`
                  : `${userObj.streetAddress}`,

                locality: userObj.city as string,
                region: userObj.state as string,
                postalCode: userObj.postalCode as string,
                country: "AU",
              },
              shippingAddress: {
                email: userObj.email,
                firstName: userObj.firstName as string,
                lastName: userObj.lastName as string,
                displayName: `${userObj?.firstName} ${userObj.lastName}`,
                companyName: userObj.company as string,
                phoneNumber: userObj.phoneNumber as string,
                addressLine1: userObj.apartmentOrUnit
                  ? `${userObj.apartmentOrUnit} / ${userObj.streetAddress}`
                  : `${userObj.streetAddress}`,

                locality: userObj.city as string,
                region: userObj.state as string,
                postalCode: userObj.postalCode as string,
                country: "AU",
              },
            },
            {
              onSuccess(data, variables, context) {
                const orderId = data?.id as string;
                const totalMoney =
                  data?.totalMoney?.amount?.toString() as string;

                paymentMutation.mutate(
                  {
                    orderId: orderId,
                    totalMoney: totalMoney,
                    token: token.token as string,
                  },
                  {
                    onSuccess(data, variables, context) {
                      if (data?.status === "APPROVED") {
                        completeOrderMutation.mutate(
                          {
                            orderId: orderId,
                            paymentId: data?.id as string,
                          },
                          {
                            onSuccess(data, variables, context) {
                              setOrderProcessing(false);
                              dispatch({
                                type: "CLEAR_CART",
                              });
                              router.push(`/order/${orderId}?success=true`);
                            },
                          }
                        );
                      }
                    },
                  }
                );
              },
            }
          );
        }
      }}
    >
      {children}
    </PaymentForm>
  );
};

export default PaymentWrapper;
