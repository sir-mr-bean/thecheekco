import { CreditCard, GooglePay } from "react-square-web-payments-sdk";
import { CartState } from "../../context/Context";
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
import { CatalogObject } from "square";
import PickupToggle from "@/components/Checkout/PickupToggle";
import ShippingForm from "@/components/Checkout/ShippingForm";
import PaymentWrapper from "@/components/Checkout/PaymentWrapper";
import { CartObject } from "@/types/CartObject";
import { Session } from "next-auth";
import CACForm from "@/components/Checkout/CACForm";

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
  const [pickup, setPickup] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const shippingInfoCheckboxRef = useRef<HTMLInputElement>(null);
  const {
    cart,
  }: {
    cart: CartObject[];
  } = CartState();
  const [total, setTotal] = useState(0);
  const tax = (parseInt(total.toFixed(2)) * 0.1).toFixed(2);
  const products = cart;
  const [termsAccepted, setTermsAccepted] = useState(false);
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
  const [shippingInfoSet, setShippingInfoSet] = useState(false);
  const [readyForPayment, setReadyForPayment] = useState(false);

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

  const handleCustomerInfoComplete = (userObject: typeof userObj) => {
    console.log(userObject);
    if (termsAccepted) {
      if (
        userObject.firstName &&
        userObject.streetAddress &&
        userObject.city &&
        userObject.postalCode
      ) {
        setCustomerInfoSet(true);
      } else {
        toast.error("Please fill out all fields");
        console.log(validationErrors);
        if (userObject.firstName === "") {
          console.log("first name is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting name to true");
            return { ...validationErrors, name: true };
          });
        }
        if (userObject.streetAddress === "") {
          console.log("street address is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting street address to true");
            return { ...validationErrors, streetAddress: true };
          });
        }
        if (userObject.city === "") {
          console.log("city is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting city to true");
            return { ...validationErrors, city: true };
          });
        }
        if (userObject.postalCode === "") {
          console.log("postal code is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting postal code to true");
            return { ...validationErrors, zip: true };
          });
        }
        if (userObject.phoneNumber === "") {
          console.log("phone number is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting phone number to true");
            return { ...validationErrors, phone: true };
          });
        }
        if (userObject.email === "") {
          console.log("email is empty");
          setValidationErrors((validationErrors) => {
            console.log("setting email to true");
            return { ...validationErrors, email: true };
          });
        }

        console.log(validationErrors);
      }
    } else {
      toast.error("You must accept the terms and conditions to continue.");
      if (termsCheckboxRef.current) {
        termsCheckboxRef.current.focus();
      }
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
          userObj.postalCode &&
          userObj.phoneNumber &&
          userObj.email
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

  return (
    <>
      <SuccessModal
        orderComplete={orderComplete}
        setOrderComplete={setOrderComplete}
      />
      <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-lg shadow-black font-gothic min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          {total && (
            <>
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="flex flex-col-reverse sm:flex-row sm:flex-1 lg:max-w-none w-full">
                  <div className="w-full">
                    <div className="flex flex-col justify-start items-start text-text-primary w-full">
                      <div className="flex flex-col justify-between w-full items-center p-2 sm:p-4">
                        <span className="hidden sm:block whitespace-nowrap text-xl font-medium pt-3 sm:pt-0 my-3">
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
                            <CACForm
                              termsAccepted={termsAccepted}
                              setTermsAccepted={setTermsAccepted}
                              userObj={userObj}
                              setUserObj={setUserObj}
                              register={register}
                            />
                            <div className="w-full">
                              <PaymentWrapper
                                setOrderProcessing={setOrderProcessing}
                                total={total}
                                userObj={userObj}
                              >
                                <div className="w-full flex flex-col space-y-4 pt-3">
                                  <h2 className="text-lg font-medium py-3">
                                    Payment Method
                                  </h2>
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
                                </div>
                              </PaymentWrapper>
                            </div>
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
                                onClick={() =>
                                  handleCustomerInfoComplete(userObj)
                                }
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
                                >
                                  <div className="w-full flex flex-col space-y-4 pt-3">
                                    <h2 className="text-lg font-medium py-3">
                                      Payment Method
                                    </h2>
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
                                  </div>
                                </PaymentWrapper>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-min md:sticky md:top-44 scroll-smooth">
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
                          <dt>Taxes</dt>
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
                        <div className="flex justify-between border-t border-text-primary text-text-primary pt-6">
                          <dt className="text-base">Total</dt>
                          <dd className="text-base">${total.toFixed(2)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
