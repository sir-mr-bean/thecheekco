import { AiOutlineQuestionCircle, AiOutlineClose } from "react-icons/ai";
import { CartState } from "@/context/Cart/Context";
import { useState, useEffect, Dispatch } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartObject } from "@/types/CartObject";
import Head from "next/head";
import useShippingRate from "@/utils/hooks/useShippingRate";
import { Popover } from "@headlessui/react";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default function cart() {
  const [total, setTotal] = useState(0);
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
  const [mounted, setMounted] = useState(false);
  const [shipping, setShipping] = useState(0);
  const tax = (parseInt(total.toFixed(2)) * 0.1).toFixed(2);

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
    setMounted(true);
  }, []);

  const handleRemove = (product: CartObject) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      item: product,
    });
  };
  const handleSetQuantity = (
    product: CartObject,
    qty: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch({
      type: "SET_QUANTITY",
      item: product,
      quantity: parseInt(qty.target.value),
    });
  };

  const products = cart;

  return (
    <>
      <Head>
        <title>The Cheek Co. - My Cart</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-1 mt-16 rounded-md bg-white font-gothic md:mx-16">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-light tracking-tight text-text-primary sm:text-4xl">
              Shopping Cart
            </h1>
            {mounted && products && products.length ? (
              <form className="mt-12 w-full items-center justify-center lg:flex lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="w-full">
                  <h2 id="cart-heading" className="sr-only">
                    Items in your shopping cart
                  </h2>

                  <ul
                    role="list"
                    className="w-full divide-y divide-text-secondary border-t border-b border-text-secondary"
                  >
                    {products.map((product: CartObject, productIdx: number) => {
                      return (
                        <li key={product.id} className="flex py-6 px-2 ">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src={
                                product?.productImage
                                  ? product?.productImage
                                  : "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                              }
                              width={200}
                              height={200}
                              layout="responsive"
                              alt={product.itemData?.name}
                              className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">
                                    <Link
                                      href="/shop/[category]/[id]"
                                      as={`/shop/${
                                        product?.categoryData?.name
                                      }/${product.itemData?.name
                                        ?.replace(/ /g, "-")
                                        .toLowerCase()}`}
                                    >
                                      <span className="font-medium text-text-primary hover:text-text-secondary">
                                        {product.itemData?.name}
                                      </span>
                                    </Link>
                                  </h3>
                                </div>
                                <div className="mt-1 flex text-sm"></div>
                                <p className="mt-1 text-sm font-medium text-text-primary">
                                  $
                                  {(
                                    parseInt(
                                      parseInt(
                                        product.itemData?.variations?.[0].itemVariationData?.priceMoney?.amount?.toString() as string
                                      ).toFixed(2)
                                    ) / 100
                                  ).toFixed(2)}
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-0 sm:pr-2">
                                <label
                                  htmlFor={`quantity-${productIdx}`}
                                  className="sr-only"
                                >
                                  Quantity, {product.itemData?.name}
                                </label>
                                <select
                                  onChange={(e) =>
                                    handleSetQuantity(product, e)
                                  }
                                  id={`quantity-${productIdx}`}
                                  name={`quantity-${productIdx}`}
                                  defaultValue={product.quantity}
                                  className="block w-fit appearance-none rounded-md border border-text-secondary py-1.5 px-2.5 pr-5 text-left text-base text-xs font-medium text-text-secondary accent-text-secondary shadow-sm focus:border-text-secondary focus:outline-none focus:ring-1 focus:ring-text-secondary sm:text-sm"
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
                                    className="-m-2 inline-flex p-2 text-text-primary hover:text-text-secondary"
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
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Order summary */}
                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 w-full rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8"
                >
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-text-primary"
                  >
                    Order summary
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-text-secondary">
                        Subtotal (ex GST)
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        ${(total - parseFloat(tax)).toFixed(2)}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between border-t border-text-secondary pt-4">
                      <dt className="text-sm text-text-secondary">GST</dt>

                      <dd className="text-sm font-medium text-text-primary">
                        ${tax}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-text-secondary pt-4">
                      <dt className="flex items-center text-sm text-text-secondary">
                        <span>Shipping estimate</span>
                        <a
                          href="#"
                          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">
                            Learn more about how shipping is calculated
                          </span>
                          <Popover className="relative">
                            <Popover.Button>
                              <AiOutlineQuestionCircle
                                className="h-5 w-5 text-text-secondary"
                                aria-hidden="true"
                              />
                            </Popover.Button>
                            <Popover.Panel className="absolute -left-20 -top-16 z-10">
                              <div className="flex w-full flex-col whitespace-nowrap rounded-lg bg-bg-tan p-2 text-center font-gothic text-xs text-text-primary sm:text-sm">
                                <span>
                                  Free shipping on all orders over $100 😍
                                </span>
                                <a href="/shipping-policy">
                                  Click here to learn more!
                                </a>
                              </div>
                            </Popover.Panel>
                          </Popover>
                        </a>
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-text-secondary pt-4">
                      <dt className="text-base font-medium text-text-primary">
                        Order total
                      </dt>
                      <dd className="text-base font-medium text-text-primary">
                        $
                        {shipping > 0
                          ? (total + Number(shipping)).toFixed(2)
                          : total.toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <Link href="/checkout">
                      <div className="w-full cursor-pointer rounded-md border border-transparent bg-button py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-button/90">
                        Checkout
                      </div>
                    </Link>
                  </div>
                </section>
              </form>
            ) : (
              <div className="flex flex-col space-y-4 py-4">
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
      </div>
    </>
  );
}
