import { CreditCard } from "react-square-web-payments-sdk";
import { Client, Environment, ApiError } from "square";
import * as React from "react";
import { CartState } from "../context/Context";
import { useState, useEffect } from "react";

export default function checkout() {
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

  const handleRemove = (product) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      item: product,
    });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>

        <div className="max-w-lg mx-auto grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-lg mx-auto w-full">
            <h2 className="sr-only">Order summary</h2>

            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {products &&
                  products.map((product) => (
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
                            <h3 className="text-gray-900">
                              <a href={product.href}>
                                {product.attributes.name}
                              </a>{" "}
                              x {product.quantity}
                            </h3>
                            <p className="text-gray-900">
                              $
                              {(
                                product.attributes.price * product.quantity
                              ).toFixed(2)}
                            </p>
                            <p className="hidden text-gray-500 sm:block">
                              {product.color}
                            </p>
                            <p className="hidden text-gray-500 sm:block">
                              {product.size}
                            </p>
                          </div>
                          <div className="flex-none flex space-x-4">
                            <button
                              type="button"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Edit
                            </button>
                            <div className="flex border-l border-gray-300 pl-4">
                              <button
                                onClick={() => handleRemove(product)}
                                type="button"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
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
            </div>

            <dl className="text-sm font-medium text-gray-500 mt-10 space-y-6">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">${total.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-gray-900">${(total * 0.1).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-gray-900">$14.00</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 text-gray-900 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">$126.32</dd>
              </div>
            </dl>
          </div>

          <div className="max-w-lg mx-auto w-full">
            <CreditCard includeInputLabels />

            <div className="relative mt-8">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-medium text-gray-500">
                  or
                </span>
              </div>
            </div>

            <form className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-500">
                  I have read the terms and conditions and agree to the sale of
                  my personal information to the highest bidder.
                </label>
              </div>

              <button
                type="submit"
                disabled
                className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </form>

            <div className="mt-10 border-t border-b border-gray-200 divide-y divide-gray-200">
              <button
                type="button"
                disabled
                className="w-full py-6 text-left text-lg font-medium text-gray-500 cursor-auto"
              >
                Payment details
              </button>
              <button
                type="button"
                disabled
                className="w-full py-6 text-left text-lg font-medium text-gray-500 cursor-auto"
              >
                Shipping address
              </button>
              <button
                type="button"
                disabled
                className="w-full py-6 text-left text-lg font-medium text-gray-500 cursor-auto"
              >
                Billing address
              </button>
              <button
                type="button"
                disabled
                className="w-full py-6 text-left text-lg font-medium text-gray-500 cursor-auto"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
