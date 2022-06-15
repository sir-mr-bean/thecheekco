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
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const termsCheckboxRef = useRef(null);
  const shippingInfoCheckboxRef = useRef(null);
  const { cart, dispatch } = CartState();
  const [total, setTotal] = useState(0);
  const products = cart;
  const [loggingIn, setLoggingIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sameAsCustomerInfo, setSameAsCustomerInfo] = useState(false);
  const [incorrectCreds, setIncorrectCreds] = useState(false);
  const session = useSession();
  const [userObj, setUserObj] = useState<User>(session?.data?.user as User);
  const [userShippingObj, setUserShippingObj] = useState({
    firstName: "",
    lastName: "",
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
    let sum: number = 0;
    cart.forEach((product: Product) => {
      sum +=
        (product.variations[0].item_variation_data.price_money.amount / 100) *
        product.quantity;
    });
    setTotal(parseInt(sum.toFixed(2)));
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
      }
    }
  };

  const handleShippingInfoComplete = () => {
    console.log("1");
    if (sameAsCustomerInfo) {
      console.log("2");
      if (
        userObj.firstName &&
        userObj.streetAddress &&
        userObj.city &&
        userObj.state &&
        userObj.postalCode
      ) {
        console.log("3");
        setShippingInfoSet(true);
      }
    } else if (
      userShippingObj.firstName &&
      userShippingObj.streetAddress &&
      userShippingObj.city &&
      userShippingObj.state &&
      userShippingObj.postalCode
    ) {
      setShippingInfoSet(true);
    }
  };

  const handleReadyForPayment = () => {
    if (customerInfoSet && shippingInfoSet) {
      setReadyForPayment(true);
    }
  };

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const q = query(collection(db, "users"), where("uid", "==", user.uid));

      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
      router.push("/profile");
    } catch (e) {
      const result = (e as Error).message;
      console.error(result);
      alert(result);
    }
  };

  const handleFacebookLogin = async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      const user = res.user;

      const q = query(collection(db, "users"), where("uid", "==", user.uid));

      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "facebook",
          email: user.email,
        });
      }
      router.push("/profile");
    } catch (e) {
      const result = (e as Error).message;
      console.error(result);
      alert(result);
    }
  };

  const handleAccountLogin = async () => {
    if (!emailRef.current || !passRef.current) return;
    setLoggingIn(true);
    try {
      const result = await logInWithEmailAndPassword(
        emailRef.current.value,
        passRef.current.value
      );

      setLoggingIn(false);
    } catch (error) {}
  };

  const logInWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    let result;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const result = (e as Error).message;
      if (result.includes("invalid-email")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
      if (result.includes("wrong-password")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
    }
    return result as UserCredential;
  };

  return (
    <>
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
            const orderResponse = await fetch("/api/order", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                order: {
                  locationId: process.env.SQUARE_LOCATION_ID,
                  referenceID: "This is a test",
                  lineItems: [
                    cart.map((item: Product) => ({
                      catalogObjectId: item.variations[0].id,
                      quantity: item.quantity.toString(),
                      modifiers: [
                        {
                          name: item.name,
                          catalogObjectId: item.id,
                        },
                      ],
                    })),
                  ],
                },
              }),
            });
            const newOrder = await orderResponse.json();

            const response = await fetch("/api/pay", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                // TO DO - ADD SHIPPING
                orderId: newOrder.order.id,
                amount: newOrder.order.totalMoney.amount,
                locationId: newOrder.order.locationId,
              }),
            });

            const paymentResponse = await response.json();
          }}
        >
          <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-lg shadow-black font-gothic">
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="flex flex-col-reverse sm:flex-row sm:flex-1 lg:max-w-none w-full">
                  <div className="w-full">
                    <div className="flex flex-col justify-start items-start text-text-primary w-full">
                      <div className="flex flex-col justify-between w-full items-center">
                        <span className="hidden sm:block whitespace-nowrap text-xl font-medium pt-3 sm:pt-0">
                          Checkout
                        </span>
                        {!userObj && (
                          <>
                            <h2 className="text-sm whitespace-nowrap">
                              Already have an account?
                            </h2>
                            <div className="flex flex-col w-full">
                              <Disclosure>
                                {({ open }: any) => (
                                  <>
                                    <Disclosure.Button
                                      as="div"
                                      className="flex text-sm items-center"
                                    >
                                      <h2
                                        className={
                                          open
                                            ? `hidden`
                                            : `text-text-secondary cursor-pointer w-full flex justify-center items-center`
                                        }
                                      >
                                        Log In
                                      </h2>
                                    </Disclosure.Button>
                                    <div>
                                      <Disclosure.Panel
                                        as="div"
                                        className="w-full flex flex-col"
                                      >
                                        <div className="w-full">
                                          <div className="w-full">
                                            <p className="text-sm font-medium text-center py-2">
                                              Sign in with
                                            </p>

                                            <div>
                                              <div className="mt-1 grid grid-cols-2 gap-3 max-w-xl mx-auto">
                                                <div>
                                                  <button
                                                    onClick={() =>
                                                      handleFacebookLogin()
                                                    }
                                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm shadow-text-secondary bg-white text-sm font-medium  hover:bg-gray-50 "
                                                  >
                                                    <span className="sr-only">
                                                      Sign in with Facebook
                                                    </span>
                                                    <AiOutlineFacebook
                                                      size={22}
                                                      color="#4267B2"
                                                    />
                                                  </button>
                                                </div>

                                                <div>
                                                  <button
                                                    onClick={() =>
                                                      handleGoogleLogin()
                                                    }
                                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm shadow-text-secondary bg-white text-sm font-medium  hover:bg-gray-50"
                                                  >
                                                    <span className="sr-only">
                                                      Sign in with Google
                                                    </span>
                                                    <FcGoogle
                                                      size={22}
                                                      color="#1DA1F2"
                                                    />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-6 relative">
                                              <div
                                                className="absolute inset-0 flex items-center"
                                                aria-hidden="true"
                                              >
                                                <div className="w-full border-t border-gray-300" />
                                              </div>
                                              <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-text-primary">
                                                  Or
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-6 ">
                                            <form
                                              action="#"
                                              method="POST"
                                              className="space-y-6 text-text-primary"
                                            >
                                              <div>
                                                <label
                                                  htmlFor="email"
                                                  className="block text-sm font-medium "
                                                >
                                                  Email address
                                                </label>
                                                <div className="mt-1">
                                                  <input
                                                    ref={emailRef}
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm shadow-text-secondary placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
                                                  />
                                                </div>
                                              </div>

                                              <div className="space-y-1">
                                                <label
                                                  htmlFor="password"
                                                  className="block text-sm font-medium "
                                                >
                                                  Password
                                                </label>
                                                <div className="mt-1">
                                                  <input
                                                    ref={passRef}
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    required
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm shadow-text-secondary placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
                                                  />
                                                </div>
                                              </div>

                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <input
                                                    id="remember-me"
                                                    name="remember-me"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-text-primary focus:ring-text-primary border-gray-300 rounded"
                                                  />
                                                  <label
                                                    htmlFor="remember-me"
                                                    className="ml-2 block text-sm"
                                                  >
                                                    Remember me
                                                  </label>
                                                </div>

                                                <div className="">
                                                  <a
                                                    href="#"
                                                    className="text-sm text-text-primary hover:text-text-primary"
                                                  >
                                                    Forgot your password?
                                                  </a>
                                                </div>
                                              </div>

                                              <div>
                                                <button
                                                  onClick={handleAccountLogin}
                                                  type="button"
                                                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary       "
                                                >
                                                  {loggingIn ? (
                                                    <BeatLoader
                                                      color="#602d0d"
                                                      loading={loggingIn}
                                                      size={8}
                                                    />
                                                  ) : (
                                                    <>Sign In</>
                                                  )}
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </Disclosure.Panel>
                                    </div>
                                  </>
                                )}
                              </Disclosure>
                            </div>
                          </>
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
                                      id="terms"
                                      name="terms"
                                      type="checkbox"
                                      className="h-5 w-5 border-gray-300 rounded checked:bg-text-secondary accent-text-secondary text-text-secondary focus:ring-text-secondary"
                                    />
                                    <label
                                      htmlFor="terms"
                                      className="text-xs text-text-primary"
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
                          <div className="w-full flex flex-col space-y-2 pt-3">
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
            </div>
          </div>
        </PaymentForm>
      )}
    </>
  );
}
