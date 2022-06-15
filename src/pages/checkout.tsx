import { CreditCard, GooglePay } from "react-square-web-payments-sdk";
import { PaymentForm } from "react-square-web-payments-sdk";
import { CartState } from "../../context/Context";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Disclosure } from "@headlessui/react";
import { useAuth } from "../../context/FirebaseAuthContext";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { auth, db } from "../../utils/firebaseConfig";
import BeatLoader from "react-spinners/BeatLoader";
import { Product } from "@/types/Product";
import UserForm from "../../components/Checkout/UserForm";
import GuestForm from "../../components/Checkout/GuestForm";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { UserState } from "@/context/User/userContext";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import toast from "react-hot-toast";
import SignInHeader from "@/components/Checkout/SignInHeader";
import { trpc } from "@/utils/trpc";
import { LineItem } from "@square/web-sdk";
import { OrderLineItem } from "square";

export default function checkout() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const streetAddressInputRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(true);
  //const { userObj } = useAuth();
  const { userObj: obj, dispatch: UserDispatch } = UserState();
  const squareAPI = trpc.useMutation(["createOrder"]);

  const termsCheckboxRef = useRef(null);
  const shippingInfoCheckboxRef = useRef(null);
  const { cart, dispatch } = CartState();
  const [total, setTotal] = useState(0);
  const products = cart;
  const [loggingIn, setLoggingIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sameAsCustomerInfo, setSameAsCustomerInfo] = useState(false);

  const session = useSession();
  const [userObj, setUserObj] = useState<User>(session?.data?.user as User);
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
  const [shippingInfoSet, setShippingInfoSet] = useState(false);
  const [readyForPayment, setReadyForPayment] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);

  useEffect(() => {
    let sum = 0;
    cart.forEach((product: Product) => {
      sum +=
        (product.variations[0].item_variation_data.price_money.amount / 100) *
        product.quantity;
    });
    setTotal(parseInt(sum.toFixed(2)));
    console.log("total is ", sum);
  }, [cart]);

  const handleCustomerInfoComplete = () => {
    if (termsAccepted) {
      if (
        userObj.firstName &&
        userObj.streetAddress &&
        userObj.city &&
        userObj.state &&
        userObj.postalCode
      ) {
        setCustomerInfoSet(true);
      } else {
        toast.error("Please fill out all fields");
      }
    } else {
      toast.error("You must accept the terms and conditions to continue.");
    }
  };

  const handleShippingInfoComplete = () => {
    console.log("1");
    if (sameAsCustomerInfo) {
      console.log("2");
      if (termsAccepted) {
        if (
          userObj.firstName &&
          userObj.streetAddress &&
          userObj.city &&
          userObj.state &&
          userObj.postalCode
        ) {
          console.log("3");
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
      userShippingObj.postalCode
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

  return (
    <>
      <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-lg shadow-black font-gothic min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          {total && (
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
                console.log(token);
                const createOrder = squareAPI.mutate({
                  lineItems: cart.map((product: Product) => {
                    return {
                      catalogObjectId: product.variations[0].id,
                      quantity: product.quantity,
                      modifiers: [
                        {
                          name: product.name,
                          catalogObjectId: product.id,
                        },
                      ],
                    };
                  }),
                  referenceId: token.token as string,
                  billingAddress: {
                    email: userObj.email,
                    displayName: `${userObj?.firstName} ${userObj.lastName}`,
                    companyName: userObj.company as string,
                    phoneNumber: userObj.phoneNumber as string,
                    addressLine1: userObj.apartmentOrUnit
                      ? `${userObj.apartmentOrUnit} / ${userObj.streetNumber} ${userObj.streetAddress}`
                      : `${userObj.streetNumber} ${userObj.streetAddress}`,

                    locality: userObj.city as string,
                    region: userObj.state as string,
                    postalCode: userObj.postalCode as string,
                    country: "AU",
                  },
                  shippingAddress: {
                    email: userObj.email,
                    displayName: `${userObj?.firstName} ${userObj.lastName}`,
                    companyName: userObj.company as string,
                    phoneNumber: userObj.phoneNumber as string,
                    addressLine1: userObj.apartmentOrUnit
                      ? `${userObj.apartmentOrUnit} / ${userObj.streetNumber} ${userObj.streetAddress}`
                      : `${userObj.streetNumber} ${userObj.streetAddress}`,

                    locality: userObj.city as string,
                    region: userObj.state as string,
                    postalCode: userObj.postalCode as string,
                    country: "AU",
                  },
                });

                console.log(createOrder);

                // const response = await fetch("/api/pay", {
                //   method: "POST",
                //   headers: {
                //     "Content-type": "application/json",
                //   },
                //   body: JSON.stringify({
                //     sourceId: token.token,
                //     // TO DO - ADD SHIPPING
                //     orderId: newOrder.order.id,
                //     amount: newOrder.order.totalMoney.amount,
                //     locationId: newOrder.order.locationId,
                //   }),
                // });

                // const paymentResponse = await response.json();
              }}
            >
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="flex flex-col-reverse sm:flex-row sm:flex-1 lg:max-w-none w-full">
                  <div className="w-full">
                    <div className="flex flex-col justify-start items-start text-text-primary w-full">
                      <div className="flex flex-col justify-between w-full items-center p-2 sm:p-4">
                        <span className="hidden sm:block whitespace-nowrap text-xl font-medium pt-3 sm:pt-0">
                          Checkout
                        </span>
                        {!userObj && (
                          <div>
                            <SignInHeader />
                          </div>
                        )}
                        {userObj ? (
                          <UserForm
                            termsAccepted={termsAccepted}
                            setTermsAccepted={setTermsAccepted}
                            userObj={userObj}
                            setUserObj={setUserObj}
                          />
                        ) : (
                          <GuestForm
                            termsAccepted={termsAccepted}
                            setTermsAccepted={setTermsAccepted}
                          />
                        )}
                        {!customerInfoSet && (
                          <button
                            type="button"
                            onClick={handleCustomerInfoComplete}
                            disabled={!termsAccepted}
                            className="w-full flex justify-center py-2 my-4 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
                          >
                            Continue
                          </button>
                        )}
                        {customerInfoSet && (
                          <>
                            <form className="mt-4 text-text-primary font-gothic w-full">
                              <div className="">
                                <div className="flex justify-between">
                                  <h2 className="text-lg font-medium ">
                                    Shipping Information
                                  </h2>
                                  <div className="flex items-center space-x-2 ">
                                    <input
                                      onChange={() =>
                                        setSameAsCustomerInfo(
                                          !sameAsCustomerInfo
                                        )
                                      }
                                      ref={shippingInfoCheckboxRef}
                                      id="sameAsCustomerInfo"
                                      name="sameAsCustomerInfo"
                                      type="checkbox"
                                      className="h-5 w-5 border-gray-300 rounded checked:bg-text-secondary accent-text-secondary text-text-secondary focus:ring-text-secondary"
                                    />
                                    <label
                                      htmlFor="sameAsCustomerInfo"
                                      className="text-xs text-text-primary select-none"
                                    >
                                      Same as Customer Information
                                    </label>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                  <div>
                                    <label
                                      htmlFor="first-name"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      First name
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        id="first-name"
                                        name="first-name"
                                        autoComplete="given-name"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.firstName as string)
                                            : (userShippingObj.firstName as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            firstName: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="last-name"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Last name
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        id="last-name"
                                        name="last-name"
                                        autoComplete="family-name"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.lastName as string)
                                            : (userShippingObj.lastName as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            lastName: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="email"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Email Address
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.email as string)
                                            : (userShippingObj.email as string)
                                        }
                                        onChange={(e) =>
                                          setUserObj({
                                            ...userObj,
                                            email: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="company"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Company
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="company"
                                        id="company"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.company as string)
                                            : (userShippingObj.company as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            company: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="address"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Address
                                    </label>
                                    <div className="mt-1">
                                      <Autocomplete<
                                        ReactGoogleAutocompleteInputProps & {
                                          value: string;
                                          disabled: boolean;
                                        }
                                      >
                                        apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                                        onPlaceSelected={(place) => {
                                          console.log(place);
                                          const apartmentOrUnit =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "subpremise"
                                                )
                                            );

                                          const streetNumber =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "street_number"
                                                )
                                            );
                                          const streetAddress =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "route"
                                                )
                                            );
                                          const city =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "locality"
                                                )
                                            );
                                          const state =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "administrative_area_level_1"
                                                )
                                            );
                                          const country =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "country"
                                                )
                                            );
                                          const postalCode =
                                            place?.address_components?.find(
                                              (component) =>
                                                component.types.includes(
                                                  "postal_code"
                                                )
                                            );

                                          setUserShippingObj({
                                            ...userShippingObj,
                                            streetNumber:
                                              streetNumber?.long_name as string,
                                            streetAddress:
                                              streetNumber?.long_name
                                                ? `${streetNumber?.long_name} ${streetAddress?.long_name}`
                                                : `${streetAddress?.long_name}`,
                                            apartmentOrUnit: apartmentOrUnit
                                              ? apartmentOrUnit?.long_name
                                              : "",
                                            city: city?.long_name as string,
                                            state: state?.long_name as string,
                                            country:
                                              country?.long_name as string,
                                            postalCode:
                                              postalCode?.long_name as string,
                                          });
                                        }}
                                        options={{
                                          componentRestrictions: {
                                            country: "au",
                                          },
                                          fields: [
                                            "address_components",
                                            "formatted_address",
                                          ],
                                          types: ["address"],
                                        }}
                                        {...register("street-address")}
                                        id="street-address"
                                        //defaultValue={userObj?.streetAddress as string}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.streetAddress as string)
                                            : (userShippingObj.streetAddress as string)
                                        }
                                        inputAutocompleteValue={
                                          sameAsCustomerInfo
                                            ? (userObj.streetAddress as string)
                                            : (userShippingObj.streetAddress as string)
                                        }
                                        disabled={sameAsCustomerInfo}
                                        onChange={(e) => {
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            streetAddress: (
                                              e.target as HTMLTextAreaElement
                                            ).value,
                                          });
                                        }}
                                        className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="apartment"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Apartment, suite, etc.
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="apartment"
                                        id="apartment"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.apartmentOrUnit as string)
                                            : (userShippingObj.apartmentOrUnit as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            apartmentOrUnit: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="city"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      City
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.city as string)
                                            : (userShippingObj.city as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            city: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="country"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Country
                                    </label>
                                    <div className="mt-1">
                                      <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        disabled={sameAsCustomerInfo}
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.country as string)
                                            : (userShippingObj.country as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            country: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      >
                                        <option>Australia</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="region"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      State / Province
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        disabled={sameAsCustomerInfo}
                                        autoComplete="address-level1"
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.state as string)
                                            : (userShippingObj.state as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            state: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="postal-code"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Postal code
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        disabled={sameAsCustomerInfo}
                                        autoComplete="postal-code"
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.postalCode as string)
                                            : (userShippingObj.postalCode as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            postalCode: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor="phone"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Phone
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        disabled={sameAsCustomerInfo}
                                        autoComplete="tel"
                                        value={
                                          sameAsCustomerInfo
                                            ? (userObj.phoneNumber as string)
                                            : (userShippingObj.phoneNumber as string)
                                        }
                                        onChange={(e) =>
                                          setUserShippingObj({
                                            ...userShippingObj,
                                            phoneNumber: e.target.value,
                                          })
                                        }
                                        className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
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
                          <div className="w-full flex flex-col space-y-4 pt-3">
                            <GooglePay buttonColor="white" />
                            <CreditCard
                              includeInputLabels
                              buttonProps={{
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
                              Pay ${total.toFixed(2)}
                            </CreditCard>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-min md:sticky md:top-44">
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
                            products.map((product: Product) => (
                              <tr
                                key={product.id}
                                className="grid grid-cols-3 content-center items-center justify-center min-w-full"
                              >
                                <td className="py-4 pl-4 text-sm font-medium text-text-primary sm:pl-6 flex flex-nowrap items-center">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="flex-none w-16 h-16 object-center object-cover bg-gray-100 rounded-md"
                                  />

                                  <h3 className="text-text-primary pl-2  py-4 text-xs lg:whitespace-nowrap">
                                    <a href={"#"}>{product.name}</a>
                                  </h3>
                                </td>
                                <td className="whitespace-nowrap translate-x-3 justify-self-end px-3 py-4 text-sm">
                                  {product.quantity}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm justify-self-end">
                                  $
                                  {(
                                    parseInt(
                                      product.variations[0].item_variation_data.price_money.amount.toFixed(
                                        2
                                      )
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
                          <dt>Taxes</dt>
                          <dd className="text-text-primary">
                            ${(total * 0.1).toFixed(2)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt>Shipping</dt>
                          <dd className="text-text-primary">$14.00</dd>
                        </div>
                        <div className="flex justify-between border-t border-text-primary text-text-primary pt-6">
                          <dt className="text-base">Total</dt>
                          <dd className="text-base">${total.toFixed(2)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </PaymentForm>
          )}
        </div>
      </div>
    </>
  );
}