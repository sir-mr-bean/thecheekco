import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { WishlistState } from "@/context/Wishlist/Context";
import { CartState } from "@/context/Cart/Context";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartObject } from "@/types/CartObject";
import toast from "react-hot-toast";
import { WishlistObject } from "@/types/WishlistObject";
import Head from "next/head";
import { CatalogObject } from "square";

export default function wishlist() {
  const { wishlist, dispatch } = WishlistState();
  const { cart, dispatch: dispatchCart } = CartState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: WishlistObject, image: string) => {
    dispatchCart({
      type: "ADD_TO_CART",
      item: product.product,
      quantity: 1,
      productImage: product.productImage,
    });
    dispatch({ type: "REMOVE_FROM_WISHLIST", item: product });
    toast.custom(
      (t) => {
        return (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave after:opacity-0"
            } max-w-md w-full bg-bg-tan shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 shadow-text-primary`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Image
                    className="w-24 h-24 rounded-full"
                    height={50}
                    width={50}
                    objectFit="cover"
                    src={
                      image ||
                      "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                    }
                    alt={product.product.itemData?.name}
                  />
                </div>
                <div className="ml-3 flex-1 my-auto">
                  <p className="mt-1 text-sm text-text-primary font-gothic">
                    {product.product.itemData?.name} added to cart.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-text-primary border-opacity-10">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:text-text-primary"
              >
                Close
              </button>
            </div>
          </div>
        );
      },
      {
        duration: 3000,
      }
    );
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      handleAddToCart(product, product.productImage as string);
    });
  };

  const handleClearWishList = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const handleRemove = (product: WishlistObject) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", item: product });
  };

  const products = wishlist;
  return (
    <>
      <Head>
        <title>The Cheek Co. - My Wishlist</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      mounted && (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl tracking-tight text-text-primary sm:text-4xl">
            My Wishlist
          </h1>
          {wishlist && wishlist.length ? (
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your wishlist
                </h2>
                <div className="w-full flex flex-col items-end justify-end pb-4 cursor-pointer group">
                  <div className="relative">
                    <AiOutlineShoppingCart className="text-text-primary h-8 w-8 group-hover:w-9 group-hover:h-9 absolute -top-7 right-0" />
                    <button onClick={handleAddAllToCart}>
                      <span className="text-xs group-hover:text-sm text-text-primary">
                        Add All Items To Cart
                      </span>
                    </button>
                  </div>
                </div>

                <ul
                  role="list"
                  className="border-t border-b border-gray-200 divide-y divide-gray-200"
                >
                  {wishlist.map((product, productIdx: number) => {
                    return (
                      <li key={product.product.id} className="flex py-6 px-2 ">
                        <div className="flex-shrink-0 relative w-20 h-20">
                          <Image
                            src={
                              product?.productImage
                                ? product?.productImage
                                : "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                            }
                            width={200}
                            height={200}
                            layout="responsive"
                            alt={product.product.itemData?.name}
                            className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0 h-full">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    href="/shop/[category]/[id]"
                                    as={`/shop/${
                                      product?.product.categoryData?.name
                                    }/${product.product.itemData?.name
                                      ?.replace(/ /g, "-")
                                      .toLowerCase()}`}
                                  >
                                    <span className="font-medium text-text-primary hover:text-text-secondary">
                                      {product.product.itemData?.name}
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
                                      product.product.itemData?.variations?.[0].itemVariationData?.priceMoney?.amount?.toString() as string
                                    ).toFixed(2)
                                  ) / 100
                                ).toFixed(2)}
                              </p>
                            </div>
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
                            <div className="absolute bottom-0 right-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddToCart(
                                    product,
                                    product?.productImage as string
                                  )
                                }
                                className="-m-2 p-2 inline-flex text-green-600 hover:text-text-secondary"
                              >
                                <span className="sr-only">Remove</span>
                                <AiOutlineShoppingCart
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Order summary */}
            </form>
          ) : (
            <div className="py-4 flex flex-col space-y-4">
              <span className="text-xl text-text-primary">
                Nothing in here yet!
              </span>
              <a
                href="/shop"
                className="text-xl text-text-primary underline cursor-pointer hover:decoration-text-primary"
              >
                Find your next favourite goodie..
              </a>
            </div>
          )}
        </div>
      </div>
      )
    </>
  );
}
