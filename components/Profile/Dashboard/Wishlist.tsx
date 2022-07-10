import { CartState } from "@/context/Cart/Context";
import { WishlistState } from "@/context/Wishlist/Context";
import { WishlistObject } from "@/types/WishlistObject";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronCompactUp } from "react-icons/bs";

const Wishlist = () => {
  const { wishlist, dispatch } = WishlistState();
  const { dispatch: dispatchCart } = CartState();
  const handleRemove = (product: WishlistObject) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", item: product });
  };

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
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-bg-tan shadow-lg shadow-text-primary ring-1 ring-black ring-opacity-5`}
          >
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Image
                    className="h-24 w-24 rounded-full"
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
                <div className="my-auto ml-3 flex-1">
                  <p className="mt-1 font-gothic text-sm text-text-primary">
                    {product.product.itemData?.name} added to cart.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-text-primary border-opacity-10">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-text-primary focus:text-text-primary focus:outline-none focus:ring-2"
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

  return (
    <Disclosure as="div">
      {(open) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-t-lg border border-text-secondary  px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-button focus:outline-none focus-visible:ring focus-visible:ring-text-secondary focus-visible:ring-opacity-75">
            <span className="text-2xl">My Wishlist</span>
            <BsChevronCompactUp
              className={
                open
                  ? `h-5 w-5 rotate-180 transform text-text-primary`
                  : `h-5 w-5 text-text-primary`
              }
            />
          </Disclosure.Button>
          {wishlist.slice(0, 5).map((product, productIdx: number) => {
            return (
              <Disclosure.Panel className="border-x border-b border-text-secondary px-4 pt-4 pb-2 text-sm text-text-primary">
                <li key={product.product.id} className="flex py-6 px-2 ">
                  <div className="relative h-48 w-52 overflow-hidden ">
                    <Image
                      src={
                        product?.productImage
                          ? product?.productImage
                          : "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                      }
                      objectFit="cover"
                      width={900}
                      height={600}
                      layout="responsive"
                      alt={product.product.itemData?.name}
                      className="rounded-md"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative h-full pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
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
                          className="-m-2 inline-flex p-2 text-text-primary hover:text-text-secondary"
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
                          className="-m-2 inline-flex p-2 text-green-600 hover:text-text-secondary"
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
              </Disclosure.Panel>
            );
          })}
        </>
      )}
    </Disclosure>
  );
};

export default Wishlist;
