import { CreditCard, GooglePay } from "react-square-web-payments-sdk";
import { CartState } from "../../context/Cart/Context";
import React, { useState, useEffect, useRef, Dispatch } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import UserForm from "../../components/Checkout/UserForm";
import GuestForm from "../../components/Checkout/GuestForm";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import SignInHeader from "@/components/Checkout/SignInHeader";
import SuccessModal from "@/components/Checkout/SuccessModal";
import Image from "next/image";
import { Card, CatalogObject } from "square";
import PickupToggle from "@/components/Checkout/PickupToggle";
import ShippingForm from "@/components/Checkout/ShippingForm";
import PaymentWrapper from "@/components/Checkout/PaymentWrapper";
import { CartObject } from "@/types/CartObject";
import { Session } from "next-auth";
import CACForm from "@/components/Checkout/CACForm";
import SimpleMap from "@/components/Checkout/Map/GoogleMaps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Marker from "@/components/Checkout/Map/Marker";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import ExistingPaymentMethod from "@/components/Checkout/PaymentMethods/ExistingPaymentMethod";
import { useRouter } from "next/router";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
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
      password: "",
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
  const [userShippingObj, setUserShippingObj] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    streetNumber: "",
    streetAddress: "",
    apartmentOrUnit: "",
    city: "",
    state: "",
    country: "Australia",
    postalCode: "",
    emailAddress: "",
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
  const { data: customer, status: CustomerStatus } = trpc.useQuery([
    "square-customer.search-customer",
    {
      email: userObj.email,
    },
  ]);
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
      },
    ],
    {
      enabled: CustomerStatus === "success",
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
  }, [cart]);

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
    if (termsAccepted) {
      if (
        userObj.firstName !== "" &&
        userObj.streetAddress !== "" &&
        userObj.city !== "" &&
        userObj.postalCode !== "" &&
        userObj.email !== "" &&
        userObj.phoneNumber !== ""
      ) {
        setCustomerInfoSet(true);
      } else {
        toast.error("Please fill out all fields");
        if (userObj.firstName === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, name: true };
          });
        }
        if (userObj.streetAddress === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, streetAddress: true };
          });
        }
        if (userObj.city === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, city: true };
          });
        }
        if (userObj.postalCode === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, zip: true };
          });
        }
        if (userObj.phoneNumber === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, phone: true };
          });
        }
        if (userObj.email === "") {
          setValidationErrors((validationErrors) => {
            return { ...validationErrors, email: true };
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
    console.log(customer);
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
            const totalMoney = data?.totalMoney?.amount?.toString() as string;
            const customerId = data?.customerId as string;
            console.log(customerId);
            paymentMutation.mutate(
              {
                orderId: orderId,
                totalMoney: totalMoney,
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
      deliveryOrderMutation.mutate(
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
          referenceId: paymentMethod.id as string,
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
            const totalMoney = data?.totalMoney?.amount?.toString() as string;

            paymentMutation.mutate(
              {
                orderId: orderId,
                totalMoney: totalMoney,
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
      toast.error("Please fill out all fields");
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
      <SuccessModal
        orderComplete={orderComplete}
        setOrderComplete={setOrderComplete}
      />
      <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-text-primary font-gothic min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          {total ? (
            <>
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="flex flex-col-reverse sm:flex-row sm:flex-1 lg:max-w-none w-full">
                  <div className="sm:pl-16 w-full">
                    <div className="flex flex-col justify-start items-start text-text-primary w-full flex-1 ">
                      <div className="flex flex-col justify-between w-full items-center p-1 sm:p-4">
                        <span className="hidden sm:block whitespace-nowrap text-3xl font-medium pt-3 sm:pt-0 my-3">
                          Checkout
                        </span>
                        {status != "loading" && !session?.user && (
                          <div className="my-3 w-full flex flex-col items-center justify-center">
                            <SignInHeader />
                          </div>
                        )}

                        <PickupToggle pickup={pickup} setPickup={setPickup} />
                        {pickup ? (
                          <>
                            <div className="flex items-center space-x-2 py-10 w-full h-full">
                              <div className="flex flex-col whitespace-nowrap">
                                <span className="text-sm">Collect from:</span>
                                <span>The Cheek Co Shop</span>
                                <span>9 Shields Street Cairns</span>
                              </div>
                              <Wrapper
                                apiKey={
                                  process.env
                                    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
                                }
                                render={render}
                              >
                                <SimpleMap>
                                  <Marker
                                    position={{
                                      lat: -16.92196302222459,
                                      lng: 145.7763141413842,
                                    }}
                                    icon={{
                                      url: "https://thecheekco.vercel.app/images/logo.png",
                                      scaledSize: new window.google.maps.Size(
                                        75,
                                        75
                                      ),
                                    }}
                                  />
                                </SimpleMap>
                              </Wrapper>
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
                              className="w-full flex justify-center py-2 my-4 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
                            >
                              Continue
                            </button>
                            {pickupInfoSet && (
                              <div className="w-full relative">
                                <PaymentWrapper
                                  setOrderProcessing={setOrderProcessing}
                                  total={total}
                                  userObj={userObj}
                                  pickup={pickup}
                                  saveCardDetails={saveCardDetails}
                                  selectedPaymentMethod={selectedPaymentMethod}
                                >
                                  <div className="w-full flex flex-col space-y-4 pt-3">
                                    <h2 className="text-lg font-medium py-3">
                                      Payment Method
                                    </h2>
                                    <div className="mt-6 flex space-x-2 space-y-2 flex-col">
                                      {paymentMethods && (
                                        <div
                                          className={
                                            !newCard
                                              ? `bg-button border rounded-lg p-2 border-text-secondary`
                                              : `border rounded-lg p-2 border-text-secondary`
                                          }
                                        >
                                          <div>
                                            <h3 className="text-lg font-medium py-3">
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
                                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
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
                                          ? `border rounded-lg p-2 bg-button border-text-secondary`
                                          : `border rounded-lg p-2 border-text-secondary`
                                      }
                                    >
                                      <div className="flex flex-col items-start justify-start space-x-2 space-y-4 pt-4 ">
                                        <div className="ml-3 flex items-center h-5 space-x-4">
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
                                            className="focus:text-text-primary h-4 w-4 text-text-primary border-gray-300 c accent-text-primary"
                                          />

                                          <label
                                            className="text-lg font-medium py-3"
                                            htmlFor="new-card"
                                          >
                                            New Card
                                          </label>
                                        </div>
                                        <div className="ml-3 flex items-center h-5 space-x-4 py-8 justify-center">
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
                                            className="h-6 w-6 border-text-secondary rounded text-text-secondary focus:ring-text-secondary accent-text-secondary"
                                          />
                                          <label
                                            htmlFor="save-card-details"
                                            className="text-sm text-text-primary select-none"
                                          >
                                            Save card details for faster online
                                            checkout.
                                          </label>
                                        </div>
                                      </div>

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
                                        <div className="w-full h-full flex items-center justify-center">
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
                                className="w-full flex justify-center py-2 my-4 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
                              >
                                Continue
                              </button>
                            )}
                            {customerInfoSet && (
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
                                  className="w-full flex justify-center py-2 my-4 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
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
                                  pickup={pickup}
                                  saveCardDetails={saveCardDetails}
                                  selectedPaymentMethod={selectedPaymentMethod}
                                >
                                  <div className="w-full flex flex-col space-y-4 pt-3">
                                    <h2 className="text-lg font-medium py-3">
                                      Payment Method
                                    </h2>
                                    <div className="mt-6 flex space-x-2 space-y-2 flex-col ">
                                      {paymentMethods && (
                                        <div
                                          className={
                                            !newCard
                                              ? `bg-button border rounded-lg p-2 border-text-secondary`
                                              : `border rounded-lg p-2 border-text-secondary`
                                          }
                                        >
                                          <div>
                                            <h3 className="text-lg font-medium py-3">
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
                                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-text-secondary hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
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
                                          ? `border rounded-lg p-2 bg-button border-text-secondary`
                                          : `border rounded-lg p-2 border-text-secondary`
                                      }
                                    >
                                      <div className="flex flex-col items-start justify-start space-x-2 space-y-4 pt-4 ">
                                        <div className="ml-3 flex items-center h-5 space-x-4">
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
                                            className="focus:text-text-primary h-4 w-4 text-text-primary border-gray-300 c accent-text-primary"
                                          />

                                          <label
                                            className="text-lg font-medium py-3"
                                            htmlFor="new-card"
                                          >
                                            New Card
                                          </label>
                                        </div>
                                        <div className="ml-3 flex items-center h-5 space-x-4 py-8 justify-center">
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
                                            className="h-6 w-6 border-text-secondary rounded text-text-secondary focus:ring-text-secondary accent-text-secondary"
                                          />
                                          <label
                                            htmlFor="save-card-details"
                                            className="text-sm text-text-primary select-none"
                                          >
                                            Save card details for faster online
                                            checkout.
                                          </label>
                                        </div>
                                      </div>
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
                                        <div className="w-full h-full flex items-center justify-center">
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
                                      <div className="mt-6 relative">
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
                                                ? `px-2 bg-button`
                                                : `px-2 bg-white`
                                            }
                                          >
                                            Or continue with
                                          </span>
                                        </div>
                                      </div>

                                      <div className="py-4">
                                        <GooglePay buttonColor="white" />
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
                  <div className="sm:px-16 sm:w-2/3 h-min md:sticky md:top-44 scroll-smooth mx-auto sm:mx-0">
                    <div className="w-full h-min flex flex-col justify-center items-center p-3">
                      <h2 className="sr-only">Order summary</h2>
                      <table className="inline-flex flex-col rounded-lg border divide-y divide-gray-300 bg-button text-text-primary min-w-full">
                        <thead className="w-full min-w-full ">
                          <tr className="flex items-center justify-between min-w-full">
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6"
                            >
                              Product
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold "
                            ></th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold "
                            >
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white rounded-b-lg min-w-full">
                          {products &&
                            products.map((product) => (
                              <tr
                                key={product.id}
                                className="grid grid-cols-3 content-center items-center justify-center min-w-full"
                              >
                                <td className="py-4 pl-4 text-sm font-medium text-text-primary sm:pl-6 flex flex-nowrap items-center">
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
                                      className="flex-none w-16 h-16 object-center object-cover bg-gray-100 rounded-md"
                                    />
                                  </div>

                                  <h3 className="text-text-primary pl-2  py-4 text-xs lg:whitespace-nowrap">
                                    <a href={"#"}>{product.itemData?.name}</a>
                                  </h3>
                                </td>
                                <td className="whitespace-nowrap translate-x-3 justify-self-end px-3 py-4 text-sm">
                                  {product.quantity}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm justify-self-end">
                                  $
                                  {(
                                    parseInt(
                                      parseInt(
                                        product.itemData?.variations?.[0].itemVariationData?.priceMoney?.amount?.toString() as string
                                      ).toFixed(2)
                                    ) / 100
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      <dl className="text-sm font-medium text-text-primary mt-10 space-y-6 w-full">
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
                            <dd className="text-text-primary">$14.00</dd>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-text-secondary text-text-primary pt-6">
                          <dt className="text-base">Total</dt>
                          <dd className="text-base">${total.toFixed(2)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 flex flex-col space-y-4 items-center">
              <span className="text-xl text-text-primary">
                Nothing in here yet!
              </span>
              <a
                href="/shop"
                className="text-xl text-text-primary underline cursor-pointer hover:decoration-text-primary"
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
