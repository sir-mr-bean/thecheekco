import { CreditCard, GooglePay } from "react-square-web-payments-sdk";
import { PaymentForm } from "react-square-web-payments-sdk";
import { CartState } from "../context/Context";
import { useState, useEffect, useRef } from "react";
import Logo from "../public/images/logo.png";
import { AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import BeatLoader from "react-spinners/BeatLoader";

export default function checkout() {
  const { user } = useFirebaseAuth();
  console.log(user);
  const contactinfo = useRef();
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const termsCheckboxRef = useRef(null);
  const [checkoutAs, setCheckoutAs] = useState("user");
  const { cart, dispatch } = CartState();
  const [total, setTotal] = useState(0);
  const products = cart;
  const [loggingIn, setLoggingIn] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [userPhone, setUserPhone] = useState();
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    let sum = 0;
    cart.forEach((product) => {
      sum +=
        (
          product.variations?.[0]?.item_variation_data?.price_money?.amount /
          100
        ).toFixed(2) * product.quantity;
    });
    setTotal(sum);
  }, [cart]);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
      setUserPhone(user.phoneNumber);
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      console.log(user);
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      console.log(q);
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
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      const user = res.user;
      console.log(user);
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      console.log(q);
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
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleAccountLogin = async () => {
    setLoggingIn(true);
    try {
      const result = await logInWithEmailAndPassword(
        emailRef.current.value,
        passRef.current.value
      );
      console.log(result);
      setLoggingIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("invalid-email")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
      if (err.message.includes("wrong-password")) {
        setIncorrectCreds(true);
        setLoggingIn(false);
      }
    }
  };

  const handleRemove = (product) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      item: product,
    });
  };
  console.log(termsCheckboxRef);
  return (
    <>
      {total && (
        <PaymentForm
          applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID}
          locationId="LNW290H2QTZVK"
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
            const response = await fetch("/api/pay", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                sourceId: token.token,
                // TO DO - ADD SHIPPING
                amount: (total * 100).toFixed(0),
              }),
            });
            alert(JSON.stringify(await response.json(), null, 2));
          }}
        >
          <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-lg shadow-black">
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
              <h1 className="sr-only">Checkout</h1>
              <div className="flex flex-col-reverse sm:flex-row md:space-x-6">
                <div className="grid grid-cols-1 lg:max-w-none w-full">
                  <div className="w-full">
                    <div className="flex flex-col justify-start items-center text-text-primary w-full">
                      {!user && (
                        <Disclosure
                          defaultOpen
                          as="div"
                          className="w-full flex flex-col items-center justify-center"
                        >
                          <Disclosure.Button>
                            <h2 className="mt-6 text-xl font-extrabold ">
                              Sign in
                            </h2>
                            <h2 className="pb-6">
                              or continue as <b>guest</b>
                            </h2>
                          </Disclosure.Button>
                          <Disclosure.Panel as="div" className="w-full">
                            <div>
                              <div>
                                <p className="text-sm font-medium text-center py-2">
                                  Sign in with
                                </p>

                                <div>
                                  <div className="mt-1 grid grid-cols-2 gap-3 max-w-xl mx-auto">
                                    <div>
                                      <button
                                        onClick={() => handleFacebookLogin()}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50 "
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
                                        onClick={() => handleGoogleLogin()}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
                                      >
                                        <span className="sr-only">
                                          Sign in with Google
                                        </span>
                                        <FcGoogle size={22} color="#1DA1F2" />
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
                                    <span className="px-2 bg-bg-tan text-text-primary">
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
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
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
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-text-primary border-gray-300 rounded"
                                      />
                                      <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm "
                                      >
                                        Remember me
                                      </label>
                                    </div>

                                    <div className="text-sm">
                                      <a
                                        href="#"
                                        className="font-medium text-text-primary hover:text-text-primary"
                                      >
                                        Forgot your password?
                                      </a>
                                    </div>
                                  </div>

                                  <div>
                                    <button
                                      onClick={handleAccountLogin}
                                      type="button"
                                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary       "
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
                        </Disclosure>
                      )}

                      <form className="mt-4 text-text-primary">
                        <div className="">
                          <h2 className="text-lg font-medium ">
                            Shipping information
                          </h2>

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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                <input
                                  type="text"
                                  name="address"
                                  id="address"
                                  autoComplete="street-address"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
                                >
                                  <option>United States</option>
                                  <option>Canada</option>
                                  <option>Mexico</option>
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
                                  autoComplete="address-level1"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  autoComplete="postal-code"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
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
                                  autoComplete="tel"
                                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex space-x-2 space-y-2 flex-col">
                          <div className="flex items-center space-x-2 ">
                            <input
                              onChange={() => setTermsAccepted(!termsAccepted)}
                              ref={termsCheckboxRef}
                              id="terms"
                              name="terms"
                              type="checkbox"
                              className="h-6 w-6 border-gray-300 rounded text-text-secondary focus:ring-text-secondary"
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm text-text-primary"
                            >
                              I have read the terms and conditions and agree to
                              the sale of my personal information to the highest
                              bidder.
                            </label>
                          </div>
                          <button
                            type="button"
                            disabled={!termsAccepted}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
                          >
                            Continue
                          </button>
                        </div>
                      </form>
                      <Disclosure defaultOpen>
                        <div className="mt-10 border-t border-b border-text-primary divide-y divide-text-primary">
                          <Disclosure.Button className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto">
                            Shipping address
                          </Disclosure.Button>
                          <Disclosure.Panel open={true}>
                            CONTENT HERE
                          </Disclosure.Panel>
                          <button
                            type="button"
                            disabled
                            className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto"
                          >
                            Payment details
                          </button>
                          <button
                            type="button"
                            disabled
                            className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto"
                          >
                            Shipping address
                          </button>
                          <button
                            type="button"
                            disabled
                            className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto"
                          >
                            Shipping address
                          </button>
                          <button
                            type="button"
                            disabled
                            className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto"
                          >
                            Billing address
                          </button>
                          <button
                            type="button"
                            disabled
                            className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto"
                          >
                            Review
                          </button>
                        </div>
                      </Disclosure>
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
                          products.map((product) => (
                            <tr
                              key={product.id}
                              className="grid grid-cols-3 content-center items-center justify-center min-w-full"
                            >
                              <td className="py-4 pl-4 text-sm font-medium text-text-primary sm:pl-6 flex flex-nowrap items-center">
                                <img
                                  src={product.image}
                                  alt={product.imageAlt}
                                  className="flex-none w-16 h-16 object-center object-cover bg-gray-100 rounded-md"
                                />

                                <h3 className="text-text-primary pl-2  py-4 text-xs lg:whitespace-nowrap">
                                  <a href={product.href}>{product.name}</a>
                                </h3>
                              </td>
                              <td className="whitespace-nowrap translate-x-3 justify-self-end px-3 py-4 text-sm">
                                {product.quantity}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm justify-self-end">
                                $
                                {(
                                  (
                                    product.variations?.[0]?.item_variation_data
                                      ?.price_money?.amount / 100
                                  ).toFixed(2) * product.quantity
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
        </PaymentForm>
      )}
    </>
  );
}
