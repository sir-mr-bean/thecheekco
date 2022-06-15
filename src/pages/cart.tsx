import {
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineQuestionCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { CartState } from "@/context/Context";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/Product";

export default function cart() {
  const [total, setTotal] = useState(0);
  const { cart, dispatch } = CartState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let sum: number = 0;
    cart.forEach((product: Product) => {
      sum +=
        (product.variations[0].item_variation_data.price_money.amount / 100) *
        product.quantity;
    });
    setTotal(parseInt(sum.toFixed(2)));
  }, [cart]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemove = (product: Product) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      item: product,
    });
  };
  const handleSetQuantity = (
    product: Product,
    qty: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({
      type: "SET_QUANTITY",
      item: product,
      payload: qty.target.value,
    });
  };

  const products = cart;
  return (
    mounted && (
      <div className="bg-white mt-16 mx-1 md:mx-16 font-gothic">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl tracking-tight text-text-primary sm:text-4xl">
              Shopping Cart
            </h1>
            {products.length ? (
              <form className="mt-12 lg:flex w-full justify-center items-center lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="w-full">
                  <h2 id="cart-heading" className="sr-only">
                    Items in your shopping cart
                  </h2>

                  <ul
                    role="list"
                    className="border-t border-b border-gray-200 divide-y divide-gray-200 w-full"
                  >
                    {products.map((product: Product, productIdx: number) => {
                      return (
                        <li key={product.id} className="flex py-6 px-2 ">
                          <div className="flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">
                                    <Link
                                      href="/shop/[category]/[id]"
                                      as={`/shop/${
                                        product?.category?.category_data.name
                                      }/${product.name
                                        .replace(/ /g, "-")
                                        .toLowerCase()}`}
                                    >
                                      <span className="font-medium text-text-primary hover:text-text-secondary">
                                        {product.name}
                                      </span>
                                    </Link>
                                  </h3>
                                </div>
                                <div className="mt-1 flex text-sm"></div>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  $
                                  {(
                                    parseInt(
                                      product.variations[0].item_variation_data.price_money.amount.toFixed(
                                        2
                                      )
                                    ) / 100
                                  ).toFixed(2)}
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-0 sm:pr-2">
                                <label
                                  htmlFor={`quantity-${productIdx}`}
                                  className="sr-only"
                                >
                                  Quantity, {product.name}
                                </label>
                                <select
                                  onChange={(e) =>
                                    handleSetQuantity(product, e)
                                  }
                                  id={`quantity-${productIdx}`}
                                  name={`quantity-${productIdx}`}
                                  defaultValue={product.quantity}
                                  className="min-w-fit  max-w-full block rounded-md border border-gray-300 py-1.5 px-1 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-text-secondary focus:border-text-secondary sm:text-sm"
                                >
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                  <option value={6}>6</option>
                                  <option value={7}>7</option>
                                  <option value={8}>8</option>
                                  <option value={9}>9</option>
                                  <option value={10}>10</option>
                                </select>

                                <div className="absolute top-0 right-0">
                                  <button
                                    type="button"
                                    onClick={() => handleRemove(product)}
                                    className="-m-2 p-2 inline-flex text-text-primary hover:text-text-secondary"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <AiOutlineClose
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                              {/* {product?.inStock ? (
                              <AiOutlineCheck
                                className="flex-shrink-0 h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <AiOutlineClockCircle
                                className="flex-shrink-0 h-5 w-5 text-gray-300"
                                aria-hidden="true"
                              />
                            )} */}

                              {/* <span>
                              {product.inStock
                                ? "In stock"
                                : `Ships in ${product.leadTime}`}
                            </span> */}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Order summary */}
                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 w-full"
                >
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    Order summary
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">
                        Subtotal (ex GST)
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${(total - total * 0.1).toFixed(2)}
                      </dd>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-sm text-gray-900">GST</dt>

                      <dd className="text-sm font-medium text-gray-900">
                        ${(total * 0.1).toFixed(2)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>Shipping estimate</span>
                        <a
                          href="#"
                          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">
                            Learn more about how shipping is calculated
                          </span>
                          <AiOutlineQuestionCircle
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </a>
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        $5.00
                      </dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">
                        Order total
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        ${total.toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <Link href="/checkout">
                      <div className="cursor-pointer w-full bg-button border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                        Checkout
                      </div>
                    </Link>
                  </div>
                </section>
              </form>
            ) : (
              <div className="py-4 flex flex-col space-y-4">
                <span className="text-xl text-black">Nothing in here yet!</span>
                <a
                  href="/shop"
                  className="text-xl text-black underline cursor-pointer hover:decoration-text-primary"
                >
                  Return to shop
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
