import { CartState } from "@/context/Context";
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
}: {
  children: React.ReactNode;
  setOrderProcessing: Dispatch<boolean>;
  total: number;
  userObj: User;
}) => {
  const router = useRouter();
  const orderMutation = trpc.useMutation(["createOrder"]);
  const paymentMutation = trpc.useMutation(["createOrderPayment"]);
  const completeOrderMutation = trpc.useMutation(["completeOrderPayment"]);
  const updateOrderMutation = trpc.useMutation(["updateOrder"]);
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
        const createOrder = orderMutation.mutate(
          {
            lineItems: cart.map((product) => {
              return {
                catalogObjectId: product.itemData?.variations?.[0].id as string,
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
              console.log(data);
              const orderId = data?.id as string;
              const totalMoney = data?.totalMoney?.amount?.toString() as string;
              console.log("orderId is ", orderId);
              console.log("totalMoney is ", totalMoney);
              paymentMutation.mutate(
                {
                  orderId: orderId,
                  totalMoney: totalMoney,
                  token: token.token as string,
                },
                {
                  onSuccess(data, variables, context) {
                    console.log(data);
                    if (data?.status === "APPROVED") {
                      completeOrderMutation.mutate(
                        {
                          orderId: orderId,
                          paymentId: data?.id as string,
                        },
                        {
                          onSuccess(data, variables, context) {
                            console.log(data);
                            setOrderProcessing(false);
                            dispatch({
                              type: "CLEAR_CART",
                            });
                            router.push("/profile?orders");
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
      }}
    >
      {children}
    </PaymentForm>
  );
};

export default PaymentWrapper;
