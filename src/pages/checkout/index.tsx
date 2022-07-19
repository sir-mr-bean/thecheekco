import { CreditCard, GooglePay, ApplePay } from "react-square-web-payments-sdk";
import { CartState } from "../../../context/Cart/Context";
import React, { useState, useEffect, useRef, Dispatch } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import UserForm from "../../../components/Checkout/UserForm";
import GuestForm from "../../../components/Checkout/GuestForm";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import SignInHeader from "@/components/Checkout/SignInHeader";
import SuccessModal from "@/components/Checkout/SuccessModal";
import Image from "next/image";
import { Card } from "square";
import PickupToggle from "@/components/Checkout/PickupToggle";
import ShippingForm from "@/components/Checkout/ShippingForm";
import PaymentWrapper from "@/components/Checkout/PaymentWrapper";
import { CartObject } from "@/types/CartObject";
import CACForm from "@/components/Checkout/CACForm";
import { Status } from "@googlemaps/react-wrapper";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import ExistingPaymentMethod from "@/components/Checkout/PaymentMethods/ExistingPaymentMethod";
import { useRouter } from "next/router";
import useShippingRate from "@/utils/hooks/useShippingRate";

export type userShippingObject = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  streetNumber: string;
  streetAddress: string;
  apartmentOrUnit: string;
  city: string;
  state: string;
  country: "Australia";
  postalCode: string;
  phoneNumber: string;
};

export type validationErrors = {
  name: boolean;
  email: boolean;
  phone: boolean;
  streetAddress: boolean;
  city: boolean;
  state: boolean;
  zip: boolean;
};
export default function checkout() {
  const { getValues, register, handleSubmit, watch, formState } = useForm();
  const router = useRouter();
  const [pickup, setPickup] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [savedCardOrderProcessing, setSavedCardOrderProcessing] =
    useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const shippingInfoCheckboxRef = useRef<HTMLInputElement>(null);
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
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const tax = (parseInt(total.toFixed(2)) * 0.1).toFixed(2);
  const products = cart;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pickupTermsAccepted, setPickupTermsAccepted] = useState(false);
  const [sameAsCustomerInfo, setSameAsCustomerInfo] = useState(false);
  const [validationErrors, setValidationErrors] = useState<validationErrors>({
    name: false,
    email: false,
    phone: false,
    streetAddress: false,
    city: false,
    state: false,
    zip: false,
  });
  const { data: session, status } = useSession();
  const [userObj, setUserObj] = useState<User>(
    session?.user || {
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "",
      image: "",
      emailVerified: null,
      firstName: "",
      lastName: "",
      company: "",
      streetAddress: "",
      streetNumber: "",
      apartmentOrUnit: "",
      city: "",
      state: "ACT",
      country: "Australia",
      postalCode: "",
      email: "",
      phoneNumber: "",
      isAdmin: false,
    }
  );
  const [userShippingObj, setUserShippingObj] = useState<userShippingObject>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    streetNumber: "",
    streetAddress: "",
    apartmentOrUnit: "",
    city: "",
    state: "ACT",
    country: "Australia",
    postalCode: "",
    phoneNumber: "",
  });
  const [customerInfoSet, setCustomerInfoSet] = useState(false);
  const [pickupInfoSet, setPickupInfoSet] = useState(false);
  const [shippingInfoSet, setShippingInfoSet] = useState(false);
  const [readyForPayment, setReadyForPayment] = useState(false);
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [newCard, setNewCard] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<Card | null>({} as Card);
  const { data: customer, status: CustomerStatus } = trpc.useQuery(
    [
      "square-customer.search-customer",
      {
        email: session?.user.email || "",
      },
    ],
    {
      enabled: !!session?.user.email,
    }
  );
  const {
    data: paymentMethods,
    status: PaymentMethodStatus,
    refetch: refetchPaymentMethods,
    dataUpdatedAt,
  } = trpc.useQuery(
    [
      "square-payment.get-customer-payment-methods",
      {
        customerId: customer?.id as string,
        email: session?.user.email || "",
      },
    ],
    {
      enabled: !!customer && !!session?.user.email,
    }
  );
  const utils = trpc.useContext();
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
  const saveCardMutation = trpc.useMutation([
    "square-payment.create-customer-payment-method",
  ]);

  useEffect(() => {
    const total = cart.reduce((acc: number, cur: CartObject) => {
      return (
        acc +
        (cur.quantity *
          Number(
            cur.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount
          )) /
          100
      );
    }, 0);
    setTotal(total);
    const shippingRate = useShippingRate(cart);
    if (shippingRate) {
      if (total > 100) {
        setShipping(0);
      } else {
        setShipping(shippingRate as number);
      }
    }
  }, [cart]);

  useEffect(() => {
    if (sameAsCustomerInfo) {
      setUserShippingObj({
        firstName: (userObj.firstName as string) || ("" as string),
        lastName: (userObj.lastName as string) || ("" as string),
        email: userObj.email,
        company: (userObj.company as string) || ("" as string),
        streetNumber: (userObj.streetNumber as string) || ("" as string),
        streetAddress: (userObj.streetAddress as string) || ("" as string),
        apartmentOrUnit: (userObj.apartmentOrUnit as string) || ("" as string),
        city: (userObj.city as string) || ("" as string),
        state: (userObj.state as string) || ("" as string),
        country: "Australia",
        postalCode: (userObj.postalCode as string) || ("" as string),
        phoneNumber: (userObj.phoneNumber as string) || ("" as string),
      });
    }
  }, [sameAsCustomerInfo]);

  const handlePickupCustomerInfoComplete = (userObject: typeof userObj) => {
    if (pickupTermsAccepted) {
      if (userObject.email !== "" && userObject.phoneNumber !== "") {
        setUserObj(userObject);
        setPickupInfoSet(true);
      } else {
        toast.error("Please enter a valid email and phone number");
      }
    } else {
      toast.error("Please accept the terms and conditions");
    }
  };

  const handleCustomerInfoComplete = () => {
    const form = getValues();
    if (termsAccepted) {
      if (
        userObj.firstName &&
        userObj.streetAddress &&
        userObj.city &&
        userObj.postalCode &&
        userObj.email &&
        userObj.phoneNumber &&
        userObj.state
      ) {
        setCustomerInfoSet(true);
      } else {
        toast.error("Please fill out all fields");
        if (!userObj.firstName) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, name: true };
          });
        }
        if (!userObj.streetAddress) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, streetAddress: true };
          });
        }
        if (!userObj.city) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, city: true };
          });
        }
        if (!userObj.postalCode) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, zip: true };
          });
        }
        if (!userObj.phoneNumber) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, phone: true };
          });
        }
        if (!userObj.email) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, email: true };
          });
        }
        if (!userObj.state) {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, state: true };
          });
        }
      }
    } else {
      toast.error("You must accept the terms and conditions to continue.");
      if (termsCheckboxRef.current) {
        termsCheckboxRef.current.focus();
      }
    }
  };

  const handleExistingCardPayment = (paymentMethod: Card) => {
    setSavedCardOrderProcessing(true);
    if (pickup) {
      pickupOrderMutation.mutate(
        {
          pickupCustomer: {
            firstName: userObj.firstName as string,
            lastName: userObj.lastName as string,
            email: userObj.email as string,
            phoneNumber: userObj.phoneNumber as string,
          },

          referenceId: `${userObj.lastName} ${new Date()}` as string,
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
        },
        {
          onSuccess(data, variables, context) {
            const orderId = data?.id as string;
            const customerId = data?.customerId as string;
            paymentMutation.mutate(
              {
                orderId: orderId,
                totalMoney: data?.totalMoney?.amount as bigint,
                token: paymentMethod.id as string,
                customerId: data?.customerId as string,
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
                          setSavedCardOrderProcessing(false);
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
      const shippingObject = {
        type: "SHIPPING",
        id: "shipping",
        itemData: {
          name: "Shipping",
          priceMoney: {
            amount: shipping,
            currencyCode: "AUD",
          },
          variations: [
            {
              id: "shipping",
            },
          ],
        },
        quantity: 1,
      };

      const deliveryItems = [...cart, shippingObject];
      deliveryOrderMutation.mutate(
        {
          lineItems: deliveryItems.map((product) => {
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
          shippingTotal: shipping.toString(),
          referenceId: paymentMethod.id as string,
          billingAddress: {
            email: userObj.email,
            firstName: userObj.firstName || "",
            lastName: userObj.lastName || "",
            displayName: `${userObj?.firstName} ${userObj.lastName}`,
            companyName: (userObj.company as string) || "",
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

            paymentMutation.mutate(
              {
                orderId: orderId,
                totalMoney: data?.totalMoney?.amount as bigint,
                token: paymentMethod.id as string,
                customerId: data?.customerId as string,
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
                          setSavedCardOrderProcessing(false);
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
  };

  const handleShippingInfoComplete = () => {
    if (sameAsCustomerInfo) {
      if (termsAccepted) {
        if (
          userObj.firstName &&
          userObj.streetAddress &&
          userObj.city &&
          userObj.state &&
          userObj.postalCode &&
          userObj.phoneNumber &&
          userObj.email
        ) {
          setShippingInfoSet(true);
        } else {
          toast.error("Please fill out all fields");
        }
      } else {
        toast.error("You must accept the terms and conditions to continue.");
      }
    } else if (
      userShippingObj.firstName &&
      userShippingObj.streetAddress &&
      userShippingObj.city &&
      userShippingObj.state &&
      userShippingObj.postalCode &&
      userShippingObj.phoneNumber &&
      userShippingObj.email
    ) {
      setShippingInfoSet(true);
    } else {
      if (!userShippingObj.firstName) {
        toast.error("First name is required for shipping");
      }
      if (!userShippingObj.streetAddress) {
        toast.error("Street address is required for shipping");
      }
      if (!userShippingObj.city) {
        toast.error("City is required for shipping");
      }
      if (!userShippingObj.state) {
        toast.error("State is required for shipping");
      }
      if (!userShippingObj.postalCode) {
        toast.error("Postal code is required for shipping");
      }
      if (!userShippingObj.phoneNumber) {
        toast.error("Phone number is required for shipping");
      }
      if (!userShippingObj.email) {
        toast.error("Email is required for shipping");
      }
    }
  };

  const handleReadyForPayment = () => {
    if (customerInfoSet && shippingInfoSet) {
      setReadyForPayment(true);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      if (session?.user) {
        setUserObj(session?.user);
        setFirstLoad(false);
      }
    }
  }, [session]);

  const render = (status: Status) => {
    return <h1>{status}</h1>;
  };

  return (
    <>
      <Head>
        <title>The Cheek Co. - Checkout</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-1 mt-16 min-h-screen rounded-md bg-white font-gothic shadow-sm shadow-text-primary md:mx-8">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          {total ? (
            <>
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="flex w-full flex-col-reverse sm:flex-1 sm:flex-row lg:max-w-none">
                  <div className="w-full sm:pl-8">
                    <div className="flex w-full flex-1 flex-col items-start justify-start text-text-primary ">
                      <div className="flex w-full flex-col items-center justify-between p-1 sm:p-4">
                        <span className="my-3 hidden whitespace-nowrap pt-3 text-3xl font-medium sm:block sm:pt-0 sm:text-5xl">
                          Checkout
                        </span>
                        {status != "loading" && !session?.user && (
                          <div className="my-3 flex w-full flex-col items-center justify-center">
                            <SignInHeader />
                          </div>
                        )}

                        <PickupToggle pickup={pickup} setPickup={setPickup} />
                        {pickup ? (
                          <>
                            <div className="flex h-full w-full items-center space-x-2 py-10">
                              <div className="flex flex-col whitespace-nowrap">
                                <span className="text-sm">Collect from:</span>
                                <span>The Cheek Co Shop</span>
                                <span>9 Shields Street Cairns</span>
                                <span>(Opposite the Woolshed)</span>
                              </div>
                            </div>
                            <CACForm
                              termsAccepted={pickupTermsAccepted}
                              setTermsAccepted={setPickupTermsAccepted}
                              userObj={userObj}
                              setUserObj={setUserObj}
                              register={register}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handlePickupCustomerInfoComplete(userObj)
                              }
                              disabled={pickupTermsAccepted === false}
                              className="my-4 flex w-full justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium text-white shadow-sm shadow-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button/50 disabled:hover:border-transparent disabled:focus:ring-0"
                            >
                              Continue
                            </button>
                            {pickupInfoSet && (
                              <div className="relative w-full">
                                <PaymentWrapper
                                  setOrderProcessing={setOrderProcessing}
                                  total={total}
                                  userObj={userObj}
                                  pickup={pickup}
                                  saveCardDetails={saveCardDetails}
                                  selectedPaymentMethod={selectedPaymentMethod}
                                  shipping={shipping}
                                  userShippingObj={null}
                                >
                                  <div className="flex w-full flex-col space-y-4 pt-3">
                                    <h2 className="py-3 text-lg font-medium">
                                      Payment Method
                                    </h2>
                                    <div className="mt-6 flex flex-col space-x-2 space-y-2">
                                      {paymentMethods && (
                                        <div
                                          className={
                                            !newCard
                                              ? `rounded-lg border border-text-secondary bg-button p-2`
                                              : `rounded-lg border border-text-secondary p-2`
                                          }
                                        >
                                          <div>
                                            <h3 className="py-3 text-lg font-medium">
                                              Existing Payment Method:
                                            </h3>
                                            {paymentMethods.map(
                                              (paymentMethod) => {
                                                return (
                                                  <ExistingPaymentMethod
                                                    setNewCard={setNewCard}
                                                    newCard={newCard}
                                                    paymentMethod={
                                                      paymentMethod
                                                    }
                                                    setSelectedPaymentMethod={
                                                      setSelectedPaymentMethod
                                                    }
                                                  />
                                                );
                                              }
                                            )}

                                            <button
                                              onClick={() => {
                                                selectedPaymentMethod
                                                  ? handleExistingCardPayment(
                                                      selectedPaymentMethod
                                                    )
                                                  : setNewCard(true);
                                              }}
                                              disabled={newCard}
                                              className="flex w-full justify-center rounded-md border border-transparent bg-text-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button/50 disabled:hover:border-transparent disabled:focus:ring-0"
                                            >
                                              {savedCardOrderProcessing ? (
                                                <div className="flex w-full items-center justify-center space-x-2">
                                                  <span>Processing Order</span>
                                                  <BeatLoader
                                                    size={8}
                                                    color="#602d0d"
                                                  />
                                                </div>
                                              ) : (
                                                <span>
                                                  Pay ${total.toFixed(2)}
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      className={
                                        newCard
                                          ? `rounded-lg border border-text-secondary bg-button p-2`
                                          : `rounded-lg border border-text-secondary p-2`
                                      }
                                    >
                                      {session?.user && (
                                        <div className="flex flex-col items-start justify-start space-x-2 space-y-4 pt-4 ">
                                          <div className="ml-3 flex h-5 items-center space-x-4">
                                            <input
                                              id="new-card"
                                              onClick={() => {
                                                setNewCard(true);
                                                setSelectedPaymentMethod(null);
                                              }}
                                              aria-describedby={`new-card-description`}
                                              name="new-card"
                                              type="radio"
                                              checked={newCard}
                                              className="c h-4 w-4 border-gray-300 text-text-primary accent-text-primary focus:text-text-primary"
                                            />

                                            <label
                                              className="py-3 text-lg font-medium"
                                              htmlFor="new-card"
                                            >
                                              New Card
                                            </label>
                                          </div>
                                          <div className="ml-3 flex h-5 items-center justify-center space-x-4 py-8">
                                            <input
                                              onChange={() =>
                                                setSaveCardDetails(
                                                  (saveCardDetails: boolean) =>
                                                    !saveCardDetails
                                                )
                                              }
                                              checked={saveCardDetails}
                                              id="save-card-details"
                                              name="save-card-details"
                                              type="checkbox"
                                              className="h-6 w-6 rounded border-text-secondary text-text-secondary accent-text-secondary focus:ring-text-secondary"
                                            />
                                            <label
                                              htmlFor="save-card-details"
                                              className="select-none text-sm text-text-primary"
                                            >
                                              Save card details for faster
                                              online checkout.
                                            </label>
                                          </div>
                                        </div>
                                      )}

                                      <CreditCard
                                        includeInputLabels
                                        buttonProps={{
                                          isLoading: orderProcessing,
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
                                          {orderProcessing ? (
                                            <div className="flex w-full items-center justify-center space-x-2">
                                              <span>Processing Order</span>
                                              <BeatLoader
                                                size={8}
                                                color="#602d0d"
                                              />
                                            </div>
                                          ) : (
                                            <span>Pay ${total.toFixed(2)}</span>
                                          )}
                                        </div>
                                      </CreditCard>
                                      <div className="py-4">
                                        <GooglePay buttonColor="white" />
                                      </div>
                                    </div>
                                  </div>
                                </PaymentWrapper>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {session?.user ? (
                              <UserForm
                                termsAccepted={termsAccepted}
                                setTermsAccepted={setTermsAccepted}
                                userObj={userObj}
                                setUserObj={setUserObj}
                                register={register}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                              />
                            ) : (
                              <GuestForm
                                userObj={userObj}
                                setUserObj={setUserObj}
                                register={register}
                                termsAccepted={termsAccepted}
                                setTermsAccepted={setTermsAccepted}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors}
                              />
                            )}
                            {!customerInfoSet && (
                              <button
                                type="button"
                                onClick={() => handleCustomerInfoComplete()}
                                disabled={!termsAccepted}
                                className="my-4 flex w-full justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium text-white shadow-sm shadow-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button/50 disabled:hover:border-transparent disabled:focus:ring-0"
                              >
                                Continue
                              </button>
                            )}
                            {customerInfoSet && userShippingObj && (
                              <>
                                <ShippingForm
                                  userObj={userObj}
                                  setUserObj={setUserObj}
                                  userShippingObj={userShippingObj}
                                  setUserShippingObj={setUserShippingObj}
                                  shippingInfoCheckboxRef={
                                    shippingInfoCheckboxRef
                                  }
                                  setSameAsCustomerInfo={setSameAsCustomerInfo}
                                  sameAsCustomerInfo={sameAsCustomerInfo}
                                  register={register}
                                />
                                <button
                                  type="button"
                                  onClick={handleShippingInfoComplete}
                                  className="my-4 flex w-full justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium text-white shadow-sm shadow-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button/50 disabled:hover:border-transparent disabled:focus:ring-0"
                                >
                                  Continue
                                </button>
                              </>
                            )}
                            {shippingInfoSet && (
                              <div className="w-full">
                                <PaymentWrapper
                                  setOrderProcessing={setOrderProcessing}
                                  total={total}
                                  userObj={userObj}
                                  userShippingObj={userShippingObj}
                                  pickup={pickup}
                                  saveCardDetails={saveCardDetails}
                                  selectedPaymentMethod={selectedPaymentMethod}
                                  shipping={shipping}
                                >
                                  <div className="flex w-full flex-col space-y-4 pt-3">
                                    <h2 className="py-3 text-lg font-medium">
                                      Payment Method
                                    </h2>
                                    <div className="mt-6 flex flex-col space-x-2 space-y-2 ">
                                      {paymentMethods && (
                                        <div
                                          className={
                                            !newCard
                                              ? `rounded-lg border border-text-secondary bg-button p-2`
                                              : `rounded-lg border border-text-secondary p-2`
                                          }
                                        >
                                          <div>
                                            <h3 className="py-3 text-lg font-medium">
                                              Existing Payment Method:
                                            </h3>
                                            {paymentMethods.map(
                                              (paymentMethod: any) => {
                                                return (
                                                  <ExistingPaymentMethod
                                                    setNewCard={setNewCard}
                                                    newCard={newCard}
                                                    paymentMethod={
                                                      paymentMethod
                                                    }
                                                    setSelectedPaymentMethod={
                                                      setSelectedPaymentMethod
                                                    }
                                                  />
                                                );
                                              }
                                            )}

                                            <button
                                              onClick={() => {
                                                selectedPaymentMethod
                                                  ? handleExistingCardPayment(
                                                      selectedPaymentMethod
                                                    )
                                                  : setNewCard(true);
                                              }}
                                              disabled={newCard}
                                              className="flex w-full justify-center rounded-md border border-transparent bg-text-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button/50 disabled:hover:border-transparent disabled:focus:ring-0"
                                            >
                                              {savedCardOrderProcessing ? (
                                                <div className="flex w-full items-center justify-center space-x-2">
                                                  <span>Processing Order</span>
                                                  <BeatLoader
                                                    size={8}
                                                    color="#602d0d"
                                                  />
                                                </div>
                                              ) : (
                                                <span>
                                                  Pay ${total.toFixed(2)}
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className={
                                        newCard
                                          ? `rounded-lg border border-text-secondary bg-button p-2`
                                          : `rounded-lg border border-text-secondary p-2`
                                      }
                                    >
                                      {session?.user && (
                                        <div className="flex flex-col items-start justify-start space-x-2 space-y-4 pt-4 ">
                                          <div className="ml-3 flex h-5 items-center space-x-4">
                                            <input
                                              id="new-card"
                                              onClick={() => {
                                                setNewCard(true);
                                                setSelectedPaymentMethod(null);
                                              }}
                                              aria-describedby={`new-card-description`}
                                              name="new-card"
                                              type="radio"
                                              checked={newCard}
                                              className="c h-4 w-4 border-gray-300 text-text-primary accent-text-primary focus:text-text-primary"
                                            />

                                            <label
                                              className="py-3 text-lg font-medium"
                                              htmlFor="new-card"
                                            >
                                              New Card
                                            </label>
                                          </div>

                                          <div className="ml-3 flex h-5 items-center justify-center space-x-4 py-8">
                                            <input
                                              onChange={() =>
                                                setSaveCardDetails(
                                                  (saveCardDetails: boolean) =>
                                                    !saveCardDetails
                                                )
                                              }
                                              checked={saveCardDetails}
                                              id="save-card-details"
                                              name="save-card-details"
                                              type="checkbox"
                                              className="h-6 w-6 rounded border-text-secondary text-text-secondary accent-text-secondary focus:ring-text-secondary"
                                            />
                                            <label
                                              htmlFor="save-card-details"
                                              className="select-none text-sm text-text-primary"
                                            >
                                              Save card details for faster
                                              online checkout.
                                            </label>
                                          </div>
                                        </div>
                                      )}
                                      <CreditCard
                                        includeInputLabels
                                        buttonProps={{
                                          isLoading:
                                            orderProcessing || !newCard,

                                          css: {
                                            backgroundColor: "#a75e2f",
                                            fontSize: "14px",
                                            color: "#fff",
                                            border: "1px solid transparent",
                                            "&:hover&:not(:disabled)": {
                                              border: "1px solid black",
                                            },
                                          },
                                        }}
                                      >
                                        <div className="flex h-full w-full items-center justify-center">
                                          {orderProcessing ? (
                                            <div className="flex w-full items-center justify-center space-x-2">
                                              <span>Processing Order</span>
                                              <BeatLoader
                                                size={8}
                                                color="#602d0d"
                                              />
                                            </div>
                                          ) : (
                                            <span>
                                              Pay $
                                              {shipping > 0
                                                ? (
                                                    total + Number(shipping)
                                                  ).toFixed(2)
                                                : total.toFixed(2)}
                                            </span>
                                          )}
                                        </div>
                                      </CreditCard>
                                      <div className="relative mt-6">
                                        <div
                                          className="absolute inset-0 flex items-center"
                                          aria-hidden="true"
                                        >
                                          <div className="w-full border-t border-text-secondary" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                          <span
                                            className={
                                              newCard
                                                ? `bg-button px-2`
                                                : `bg-white px-2`
                                            }
                                          >
                                            Or continue with
                                          </span>
                                        </div>
                                      </div>

                                      <div className="py-4">
                                        <GooglePay buttonColor="white" />
                                      </div>
                                      <div className="py-4">
                                        <ApplePay />
                                      </div>
                                    </div>
                                  </div>
                                </PaymentWrapper>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto h-min w-full scroll-smooth sm:mx-0 sm:w-2/3 sm:px-8 md:sticky md:top-44">
                    <div className="flex h-min w-full flex-col items-center justify-center p-3">
                      <h2 className="sr-only">Order summary</h2>
                      <table className="inline-flex min-w-full flex-col divide-y divide-gray-300 rounded-lg border bg-button text-text-primary">
                        <thead className="w-full min-w-full ">
                          <tr className="flex min-w-full items-center justify-between">
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6"
                            >
                              Product
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold "
                            >
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="min-w-full divide-y divide-gray-200 rounded-b-lg bg-white">
                          {products &&
                            products.map((product) => (
                              <tr
                                key={product.id}
                                className="mx-1 flex min-w-full items-center justify-between"
                              >
                                <td className="ml-2 flex flex-nowrap items-center py-4 text-sm font-medium text-text-primary sm:pl-2">
                                  <div className="relative h-20 w-20">
                                    <Image
                                      src={
                                        product.productImage ||
                                        "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                      }
                                      alt={product.itemData?.name}
                                      width={75}
                                      height={75}
                                      layout="fixed"
                                      priority={true}
                                      className="h-16 w-16 flex-none rounded-md bg-gray-100 object-cover object-center"
                                    />
                                  </div>
                                  <div className="flex flex-col pl-2 text-xs">
                                    <h3 className="text-text-primary  lg:whitespace-nowrap">
                                      <a href={"#"}>{product.itemData?.name}</a>
                                    </h3>
                                    <h3>
                                      $
                                      {(
                                        parseInt(
                                          parseInt(
                                            product.itemData?.variations?.[0].itemVariationData?.priceMoney?.amount?.toString() as string
                                          ).toFixed(2)
                                        ) / 100
                                      ).toFixed(2)}
                                    </h3>
                                  </div>
                                </td>
                                <td className="justify-self-end whitespace-nowrap px-3 py-4 text-sm">
                                  {product.quantity}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      <dl className="mt-10 w-full space-y-6 text-sm font-medium text-text-primary">
                        <div className="flex justify-between">
                          <dt>Subtotal</dt>
                          <dd className="text-text-primary">
                            ${(total - total * 0.1).toFixed(2)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>GST</dt>
                          <dd className="text-text-primary">
                            ${(total * 0.1).toFixed(2)}
                          </dd>
                        </div>
                        {!pickup && (
                          <div className="flex justify-between">
                            <dt>Shipping</dt>
                            <dd className="text-text-primary">
                              {shipping > 0
                                ? `$${shipping.toFixed(2)}`
                                : "Free"}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-text-secondary pt-6 text-text-primary">
                          <dt className="text-base">Total</dt>
                          <dd className="text-base">
                            $
                            {pickup
                              ? total.toFixed(2)
                              : !pickup && shipping > 0
                              ? (total + Number(shipping)).toFixed(2)
                              : total.toFixed(2)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-4">
              <span className="text-xl text-text-primary">
                Nothing in here yet!
              </span>
              <a
                href="/shop"
                className="cursor-pointer text-xl text-text-primary underline hover:decoration-text-primary"
              >
                Return to shop
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
