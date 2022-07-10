import {
  IntroOptions,
  PageFiveOptions,
  PageFourOptions,
  PageOneOptions,
  PageThreeOptions,
  PageTwoOptions,
} from "@/types/PageOptions";
import { trpc } from "@/utils/trpc";
import { UseFormReturn } from "react-hook-form";
import {
  CreditCard,
  GooglePay,
  PaymentForm,
} from "react-square-web-payments-sdk";
import CheckoutResults from "./FinalPage/CheckoutResults";
import PageSix, {
  cheekyBoxUserGifter,
  cheekyBoxUserRecipient,
} from "../Pages/PageSix";
import { CatalogObject } from "square";
import { TokenResult } from "@square/web-sdk";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const FinalPage = ({
  introOptions,
  pageOneOptions,
  pageTwoOptions,
  pageThreeOptions,
  pageFourOptions,
  pageFiveOptions,
  gift,
  giftForm,
  gifterForm,
}: {
  introOptions: IntroOptions;
  pageOneOptions: PageOneOptions;
  pageTwoOptions: PageTwoOptions;
  pageThreeOptions: PageThreeOptions;
  pageFourOptions: PageFourOptions;
  pageFiveOptions: PageFiveOptions;
  gift: boolean;
  giftForm: UseFormReturn<any>;
  gifterForm: UseFormReturn<any>;
}) => {
  const { data: plans, status: plansStatus } = trpc.useQuery([
    "square-subscription.get-all-subscriptions",
  ]);
  const createSubscription = trpc.useMutation([
    "square-subscription.create-subscription",
  ]);
  const storeEmail = trpc.useMutation(["email.send-cheekybox-selections"]);
  const customerEmail = trpc.useMutation([
    "email.send-cheekybox-customer-email",
  ]);
  const errorEmail = trpc.useMutation(["email.send-error-email"]);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async (token: TokenResult) => {
    setOrderProcessing(true);
    console.log("handling payment", token);
    const customer = giftForm.getValues();
    const recipient = gifterForm.getValues();
    if (token.status === "OK") {
      if (introOptions.duration === "monthly") {
        createSubscription.mutate(
          {
            token: {
              status: token.status,
              token: token.token as string,
              details: {
                card: {
                  brand: token.details?.card?.brand as string,
                  expMonth: token.details?.card?.expMonth as number,
                  expYear: token.details?.card?.expYear as number,
                  last4: token.details?.card?.last4 as string,
                },
                method: token.details?.method as string,
              },
            },
            subscriptionPlanId: plans?.find(
              (plan: CatalogObject) =>
                plan.presentAtAllLocations === true &&
                plan.subscriptionPlanData?.name === "TestPlan"
            )?.id as string,
            customer: {
              email: giftForm.getValues("email") as string,
              firstName: giftForm.getValues("firstName") as string,
              lastName: giftForm.getValues("lastName") as string,
              phoneNumber: giftForm.getValues("phoneNumber") as string,
              address: giftForm.getValues("address") as string,
              city: giftForm.getValues("city") as string,
              state: giftForm.getValues("state") as string,
              postCode: giftForm.getValues("postCode") as string,
              country: "Australia",
              company: giftForm.getValues("company") as string | undefined,
            },
            recipient: {
              firstName: gift
                ? (gifterForm.getValues("firstName") as string)
                : (customer.firstName as string),
              lastName: gift
                ? (gifterForm.getValues("lastName") as string)
                : (customer.lastName as string),
              phoneNumber: gift
                ? (gifterForm.getValues("phoneNumber") as string)
                : (customer.phoneNumber as string),
              address: gift
                ? (gifterForm.getValues("address") as string)
                : (customer.address as string),
              city: gift
                ? (gifterForm.getValues("city") as string)
                : (customer.city as string),
              state: gift
                ? (gifterForm.getValues("state") as string)
                : (customer.state as string),
              postCode: gift
                ? (gifterForm.getValues("postCode") as string)
                : (customer.postCode as string),
              country: "Australia",
              company: gift
                ? (gifterForm.getValues("company") as string | undefined)
                : (customer.company as string | undefined),
            },
          },
          {
            onSuccess() {
              storeEmail.mutate(
                {
                  duration:
                    introOptions.duration === "monthly"
                      ? "Monthly"
                      : "3 Month Prepaid",
                  customer: {
                    email: giftForm.getValues("email") as string,
                    firstName: giftForm.getValues("firstName") as string,
                    lastName: giftForm.getValues("lastName") as string,
                    phoneNumber: giftForm.getValues("phoneNumber") as string,
                    address: giftForm.getValues("address") as string,
                    city: giftForm.getValues("city") as string,
                    state: giftForm.getValues("state") as string,
                    postCode: giftForm.getValues("postCode") as string,
                    country: "Australia",
                    company: giftForm.getValues("company") as
                      | string
                      | undefined,
                  },
                  recipient: {
                    firstName: gift
                      ? (gifterForm.getValues("firstName") as string)
                      : (customer.firstName as string),
                    lastName: gift
                      ? (gifterForm.getValues("lastName") as string)
                      : (customer.lastName as string),
                    phoneNumber: gift
                      ? (gifterForm.getValues("phoneNumber") as string)
                      : (customer.phoneNumber as string),
                    address: gift
                      ? (gifterForm.getValues("address") as string)
                      : (customer.address as string),
                    city: gift
                      ? (gifterForm.getValues("city") as string)
                      : (customer.city as string),
                    state: gift
                      ? (gifterForm.getValues("state") as string)
                      : (customer.state as string),
                    postCode: gift
                      ? (gifterForm.getValues("postCode") as string)
                      : (customer.postCode as string),
                    country: "Australia",
                    company: gift
                      ? (gifterForm.getValues("company") as string | undefined)
                      : (customer.company as string | undefined),
                  },
                  gifted: gift,
                  giftMessage: "",
                  selections: {
                    pageOne: pageOneOptions,
                    pageTwo: pageTwoOptions,
                    pageThree: pageThreeOptions,
                    pageFour: pageFourOptions,
                    pageFive: pageFiveOptions,
                  },
                },
                {
                  onSuccess() {
                    toast.success("Payment successful!");
                    setOrderProcessing(false);
                    setTimeout(() => {
                      router.push("/");
                    }, 3000);
                  },
                }
              );
            },
          }
        );
      } else {
        createSubscription.mutate(
          {
            token: {
              status: token.status,
              token: token.token as string,
              details: {
                card: {
                  brand: token.details?.card?.brand as string,
                  expMonth: token.details?.card?.expMonth as number,
                  expYear: token.details?.card?.expYear as number,
                  last4: token.details?.card?.last4 as string,
                },
                method: token.details?.method as string,
              },
            },
            subscriptionPlanId: plans?.find(
              (plan) =>
                plan.presentAtAllLocations === true &&
                plan.subscriptionPlanData?.name === "TestPlan"
            )?.id as string,
            customer: {
              email: giftForm.getValues("email") as string,
              firstName: giftForm.getValues("firstName") as string,
              lastName: giftForm.getValues("lastName") as string,
              phoneNumber: giftForm.getValues("phoneNumber") as string,
              address: giftForm.getValues("address") as string,
              city: giftForm.getValues("city") as string,
              state: giftForm.getValues("state") as string,
              postCode: giftForm.getValues("postCode") as string,
              country: "Australia",
              company: giftForm.getValues("company") as string | undefined,
            },
            recipient: {
              firstName: gift
                ? (gifterForm.getValues("firstName") as string)
                : (customer.firstName as string),
              lastName: gift
                ? (gifterForm.getValues("lastName") as string)
                : (customer.lastName as string),
              phoneNumber: gift
                ? (gifterForm.getValues("phoneNumber") as string)
                : (customer.phoneNumber as string),
              address: gift
                ? (gifterForm.getValues("address") as string)
                : (customer.address as string),
              city: gift
                ? (gifterForm.getValues("city") as string)
                : (customer.city as string),
              state: gift
                ? (gifterForm.getValues("state") as string)
                : (customer.state as string),
              postCode: gift
                ? (gifterForm.getValues("postCode") as string)
                : (customer.postCode as string),
              country: "Australia",
              company: gift
                ? (gifterForm.getValues("company") as string | undefined)
                : (customer.company as string | undefined),
            },
          },
          {
            onSuccess() {
              customerEmail.mutate(
                {
                  duration:
                    introOptions.duration === "monthly"
                      ? "Monthly"
                      : "3 Month Prepaid",
                  customer: {
                    email: giftForm.getValues("email") as string,
                    firstName: giftForm.getValues("firstName") as string,
                    lastName: giftForm.getValues("lastName") as string,
                    phoneNumber: giftForm.getValues("phoneNumber") as string,
                    address: giftForm.getValues("address") as string,
                    city: giftForm.getValues("city") as string,
                    state: giftForm.getValues("state") as string,
                    postCode: giftForm.getValues("postCode") as string,
                    country: "Australia",
                    company: giftForm.getValues("company") as
                      | string
                      | undefined,
                  },
                  recipient: {
                    firstName: gift
                      ? (gifterForm.getValues("firstName") as string)
                      : (customer.firstName as string),
                    lastName: gift
                      ? (gifterForm.getValues("lastName") as string)
                      : (customer.lastName as string),
                    phoneNumber: gift
                      ? (gifterForm.getValues("phoneNumber") as string)
                      : (customer.phoneNumber as string),
                    address: gift
                      ? (gifterForm.getValues("address") as string)
                      : (customer.address as string),
                    city: gift
                      ? (gifterForm.getValues("city") as string)
                      : (customer.city as string),
                    state: gift
                      ? (gifterForm.getValues("state") as string)
                      : (customer.state as string),
                    postCode: gift
                      ? (gifterForm.getValues("postCode") as string)
                      : (customer.postCode as string),
                    country: "Australia",
                    company: gift
                      ? (gifterForm.getValues("company") as string | undefined)
                      : (customer.company as string | undefined),
                  },
                  gifted: gift,
                },
                {
                  onSuccess() {
                    toast.success("Payment successful!");
                    setOrderProcessing(false);
                    setTimeout(() => {
                      router.push("/");
                    }, 3000);
                  },
                }
              );
            },
            onError(error) {
              toast.error(
                "Failed to create subscription - please check your contact information and try again."
              );
              errorEmail.mutate({
                error: error.message,
              });
              setOrderProcessing(false);
            },
          }
        );
      }
    } else {
      console.log("payment failed");
    }
  };

  return (
    <>
      <span className="flex w-full items-center justify-center pb-3 text-lg sm:text-3xl">
        luxury is just a click away.
      </span>
      <div className="flex w-full flex-col items-start justify-center rounded-xl bg-white py-4">
        <div className="w-full px-4">
          <h1 className="border border-x-transparent border-t-transparent border-b-text-secondary pb-6 text-2xl text-text-secondary">
            Subscription Box Checkout
          </h1>
        </div>
        <div className="font-gothica grid w-full grid-cols-1 justify-center  sm:grid-cols-2">
          <div className="order-last w-full p-2 sm:order-first">
            <div className="flex h-24 w-full pl-4">
              <div className="w-full pt-8 text-base">
                <span className="text-center text-text-secondary">
                  Thanks for choosing cheeky! We cannot wait to ship your
                  goodies
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center space-y-3 sm:items-start sm:pl-4">
              <span className="w-full pl-4 font-semibold text-text-secondary">
                Payment Method
              </span>
              <div className="m-4 w-fit rounded-lg bg-button p-8 sm:m-0">
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
                      amount: "100",
                      label: "Total",
                    },
                  })}
                  cardTokenizeResponseReceived={async (token, buyer) => {
                    await handlePayment(token);
                  }}
                >
                  <CreditCard
                    includeInputLabels
                    buttonProps={{
                      isLoading: false,
                      css: {
                        backgroundColor: "#a75e2f",
                        fontSize: "14px",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#E3BB9D",
                        },
                      },
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      {introOptions.duration === "monthly" ? (
                        <>
                          {orderProcessing ? (
                            <div className="flex w-full items-center justify-center space-x-2">
                              <span>Processing Order</span>
                              <BeatLoader size={8} color="#602d0d" />
                            </div>
                          ) : (
                            <span className="text-white">Pay $49.99</span>
                          )}
                        </>
                      ) : (
                        <>
                          {orderProcessing ? (
                            <div className="flex w-full items-center justify-center space-x-2">
                              <span>Processing Order</span>
                              <BeatLoader size={8} color="#602d0d" />
                            </div>
                          ) : (
                            <span className="text-white">Pay $149.97</span>
                          )}
                        </>
                      )}
                    </div>
                  </CreditCard>
                  <div className="py-4">
                    <GooglePay buttonColor="white" />
                  </div>
                </PaymentForm>
              </div>
            </div>
            <div className="pl-4 pt-4">
              <span className="text-xs text-text-secondary">
                Subscription boxes will be posted on the 7th of each new month,
                please allow up to two weeks for shipping. Subscriptions can be
                paused for up to 2 months and cancelled at any time*
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-start pl-8">
            <CheckoutResults introOptions={introOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinalPage;
