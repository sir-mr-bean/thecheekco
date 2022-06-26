import { AiOutlineClose } from "react-icons/ai";
import { WishlistState } from "@/context/Wishlist/Context";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function wishlist() {
  const { wishlist, dispatch } = WishlistState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearWishList = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const handleRemove = (product) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", item: product });
  };

  const products = wishlist;
  return (
    mounted && (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl tracking-tight text-text-primary sm:text-4xl">
            My Wishlist
          </h1>
          {wishlist.length ? (
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your wishlist
                </h2>

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
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
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
                              <p className="mt-1 text-sm font-medium text-gray-900">
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
