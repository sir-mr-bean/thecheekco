import {
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineQuestionCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { WishlistState } from "../context/Context";
import {
  addToWishList,
  removeFromWishList,
  addToCart,
} from "../context/Reducer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getStrapiURL } from "../utils/api";

export default function wishlist({ data }) {
  const { wishlist, dispatch } = WishlistState();
  const [mounted, setMounted] = useState(false);
  console.log(wishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemove = (product) => {
    removeFromWishList(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishList(product);
  };

  const products = wishlist;
  return (
    mounted && (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl tracking-tight text-text-primary sm:text-4xl">
            My Wishlist
          </h1>
          {products.length ? (
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your wishlist
                </h2>

                <ul
                  role="list"
                  className="border-t border-b border-gray-200 divide-y divide-gray-200"
                >
                  {products.map((product, productIdx) => {
                    console.log(product.attributes.categories);
                    return (
                      <>
                        <li key={product.id} className="flex py-6 sm:py-10">
                          <div className="flex-shrink-0">
                            <img
                              src={
                                product.attributes?.itemimage?.data?.attributes
                                  ?.url
                              }
                              alt={product.attributes.name}
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
                                      as={`/shop/name/${product.attributes.name
                                        .replace(/ /g, "-")
                                        .toLowerCase()}`}
                                    >
                                      <span className="font-medium text-text-primary hover:text-text-secondary">
                                        {product.attributes.name}
                                      </span>
                                    </Link>
                                  </h3>
                                </div>
                                <div className="mt-1 flex text-sm">
                                  <p className="text-gray-500">
                                    {product.color}
                                  </p>
                                  {product.size ? (
                                    <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">
                                      {product.size}
                                    </p>
                                  ) : null}
                                </div>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  {product.price}
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-0 sm:pr-9">
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
                                  className="max-w-full block rounded-md border border-gray-300 py-1.5 px-1 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-text-secondary focus:border-text-secondary sm:text-sm"
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
                              {product.inStock ? (
                                <AiOutlineCheck
                                  className="flex-shrink-0 h-5 w-5 text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <AiOutlineClockCircle
                                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                                  aria-hidden="true"
                                />
                              )}

                              <span>
                                {product.inStock
                                  ? "In stock"
                                  : `Ships in ${product.leadTime}`}
                              </span>
                            </p>
                          </div>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </section>

              {/* Order summary */}
            </form>
          ) : (
            <div className="py-4 flex flex-col space-y-4">
              <span className="text-xl text-black">Nothing in here yet!</span>
              <a
                href="/shop"
                className="text-xl text-black underline cursor-pointer hover:decoration-text-primary"
              >
                Find your next favourite goodie..
              </a>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export const getStaticProps = async () => {
  const productsURL = `https://angeles-antiques-underground-storm.trycloudflare.com/api/fetchproducts`;
  const res = await fetch(productsURL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "*",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
};
