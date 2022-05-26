import { CreditCard } from "react-square-web-payments-sdk";
import * as React from "react";
import { CartState } from "../context/Context";
import { useState, useEffect, useRef } from "react";
import Logo from "../public/images/logo.png";
import {
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineTwitter,
} from "react-icons/ai";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";

export default function checkout() {
  const contactInfoRef = useRef();
  const [checkoutAs, setCheckoutAs] = useState("user");
  const { cart, dispatch } = CartState();
  const [total, setTotal] = useState(0);
  const products = cart;

  useEffect(() => {
    let sum = 0;
    cart.forEach((product) => {
      sum += product.attributes.price * product.quantity;
    });
    setTotal(sum);
  }, [cart]);

  // useEffect(() => {
  //   const fetchRates = async () => {
  //     const params = {
  //       width: 100,
  //       height: 100,
  //       length: 100,
  //       weight: 100,
  //     };
  //     const response = await fetch("/api/rates", {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //       body: JSON.stringify(params),
  //     });
  //     return response;
  //   };

  //   fetchRates(); //.then((res) => console.log(res));
  // }, []);

  const handleRemove = (product) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      item: product,
    });
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>

        <div className="max-w-lg mx-auto grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 ">
          <div className="sticky top-36 w-full h-min">
            <div className="max-w-lg mx-auto w-full h-min">
              <h2 className="sr-only">Order summary</h2>

              <div className="flow-root">
                {products && (
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {products.map((product) => (
                      <li key={product.id} className="py-6 flex space-x-6">
                        <img
                          src={
                            product.attributes?.itemimage?.data?.attributes?.url
                          }
                          alt={product.imageAlt}
                          className="flex-none w-24 h-24 object-center object-cover bg-gray-100 rounded-md"
                        />
                        <div className="flex-auto">
                          <div className="space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6">
                            <div className="flex-auto text-sm font-medium space-y-1">
                              <h3 className="text-text-primary">
                                <a href={product.href}>
                                  {product.attributes.name}
                                </a>{" "}
                                x {product.quantity}
                              </h3>
                              <p className="text-text-primary">
                                $
                                {(
                                  product.attributes.price * product.quantity
                                ).toFixed(2)}
                              </p>
                              <p className="hidden text-text-primary sm:block">
                                {product.color}
                              </p>
                              <p className="hidden text-text-primary sm:block">
                                {product.size}
                              </p>
                            </div>
                            <div className="flex-none flex space-x-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-text-secondary hover:text-text-secondary"
                              >
                                Edit
                              </button>
                              <div className="flex border-l border-gray-300 pl-4">
                                <button
                                  onClick={() => handleRemove(product)}
                                  type="button"
                                  className="text-sm font-medium text-text-secondary hover:text-text-secondary"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <dl className="text-sm font-medium text-text-primary mt-10 space-y-6">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-text-primary">
                    ${total - (total * 0.1).toFixed(2)}
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

          <div className="max-w-lg mx-auto w-full">
            <div className="flex flex-col justify-center items-center text-text-primary w-full">
              <Image
                height={147.5}
                width={147.5}
                className=""
                src={Logo}
                alt="Workflow"
              />
              <Disclosure
                defaultOpen
                as="div"
                className="w-full flex flex-col items-center justify-center"
              >
                <Disclosure.Button>
                  <h2 className="mt-6 text-xl font-extrabold ">Sign in</h2>
                  <h2 className="pb-6">
                    or continue as <b>guest</b>
                  </h2>
                </Disclosure.Button>
                <Disclosure.Panel as="div" className="w-full">
                  <div>
                    <div>
                      <p className="text-sm font-medium ">Sign in with</p>

                      <div>
                        <div className="mt-1 grid grid-cols-3 gap-3">
                          <div>
                            <a
                              href="#"
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Facebook
                              </span>
                              <AiOutlineFacebook size={22} color="#4267B2" />
                            </a>
                          </div>

                          <div>
                            <a
                              href="#"
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Instagram
                              </span>
                              <svg className="w-6 h-6 absolute top-0">
                                <radialGradient
                                  id="RG"
                                  r="150%"
                                  cx="30%"
                                  cy="107%"
                                >
                                  <stop stop-color="#fdf497" offset="0" />
                                  <stop stop-color="#fdf497" offset="0.05" />
                                  <stop stop-color="#fd5949" offset="0.45" />
                                  <stop stop-color="#d6249f" offset="0.6" />
                                  <stop stop-color="#285AEB" offset="0.9" />
                                </radialGradient>
                              </svg>

                              <div id="IG">
                                <svg
                                  className="w-[22px] h-[22px] IGsvg"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  id="IG"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </a>
                          </div>

                          <div>
                            <a
                              href="#"
                              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium  hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Twitter
                              </span>
                              <AiOutlineTwitter size={22} color="#1DA1F2" />
                            </a>
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

                    <div className="mt-6">
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
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                          >
                            Sign in
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Disclosure>

              <form className="mt-6 text-text-primary">
                <h2 className="text-lg font-medium text-text-primary">
                  Contact information
                </h2>

                <div className="mt-6 ">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-text-primary"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email-address"
                      name="email-address"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 ">
                  <label htmlFor="phone" className="block text-sm font-medium ">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-primary focus:outline-none focus:ring-text-primary focus:border-text-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded text-text-secondary focus:ring-text-secondary"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-text-primary">
                    I have read the terms and conditions and agree to the sale
                    of my personal information to the highest bidder.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled
                  className="mt-6 w-full bg-text-sectext-text-secondary border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-secondary disabled:bg-gray-100 disabled:text-text-primary disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </form>
              <Disclosure defaultOpen>
                <div className="mt-10 border-t border-b border-text-primary divide-y divide-text-primary">
                  <Disclosure.Button className="w-full py-6 text-left text-lg font-medium text-text-primary cursor-auto">
                    Shipping address
                  </Disclosure.Button>
                  <Disclosure.Panel refName="contactInfo" open={true}>
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
              <div className="w-full">
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
