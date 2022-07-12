import { slugify } from "@/utils/hooks/useSlugify";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { CatalogObject, Order, OrderLineItem } from "square";
import { addToCart } from "@/context/Cart/Reducer";
import Image from "next/image";
import { WishlistObject } from "@/types/WishlistObject";
import { CartState } from "@/context/Cart/Context";
import toast from "react-hot-toast";
import { CartObject } from "@/types/CartObject";
import moment from "moment";
import { Disclosure } from "@headlessui/react";
import { BsChevronCompactUp } from "react-icons/bs";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const RecentOrders = ({
  customerOrders,
  setOpenTab,
}: {
  customerOrders: Order[] | undefined;
  setOpenTab: (tab: number) => void;
}) => {
  const { dispatch: dispatchCart } = CartState();
  const productIDs = [
    ...new Set(
      customerOrders
        ?.map(
          (order) =>
            order.lineItems
              ?.filter((item) => item.name !== "Shipping")
              .map((item) => item.catalogObjectId as string) ?? []
        )
        .flat()
    ),
  ];
  const { data: orderProducts, status: orderProductsStatus } = trpc.useQuery(
    [
      "square-products.search-products-by-ids",
      {
        productIds: productIDs as string[],
      },
    ],
    {
      enabled: !!customerOrders,
    }
  );
  const { data: categories, status: catStatus } = trpc.useQuery([
    "square-categories.all-categories",
  ]);

  const handleAddToCart = (product: CatalogObject) => {
    const productImage = orderProducts?.items?.find(
      (p) => p.type === "IMAGE" && product.itemData?.imageIds?.includes(p.id)
    );
    dispatchCart({
      type: "ADD_TO_CART",
      item: product,
      quantity: 1,
      productImage: productImage?.imageData?.url,
    });
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
                      productImage?.imageData?.url ||
                      "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                    }
                    alt={product.itemData?.name}
                  />
                </div>
                <div className="my-auto ml-3 flex-1">
                  <p className="mt-1 font-gothic text-sm text-text-primary">
                    {product.itemData?.name} added to cart.
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
          <Disclosure.Button className="flex w-full justify-between rounded-t-lg border border-text-secondary px-4  py-2 text-left text-sm font-medium text-text-primary hover:bg-button focus:outline-none focus-visible:ring focus-visible:ring-text-secondary focus-visible:ring-opacity-75 ui-not-open:rounded-b-lg">
            <span className="text-2xl">My Recent Orders</span>
            <BsChevronCompactUp
              className={
                open
                  ? `h-5 w-5 rotate-180 transform text-text-primary`
                  : `h-5 w-5 text-text-primary`
              }
            />
          </Disclosure.Button>
          {customerOrders && categories && customerOrders.length > 0 ? (
            customerOrders.slice(0, 2).map((order: Order, i: number) => (
              <Disclosure.Panel className="rounded-b-lg border-x border-b border-text-secondary px-4 pt-4 pb-2 text-sm text-text-primary">
                <div
                  key={order.id}
                  className="max-w-2xl divide-y  divide-text-secondary py-4"
                >
                  <h3 className="sr-only">
                    Order placed on{" "}
                    <time dateTime={order.createdAt}>{order.createdAt}</time>
                  </h3>

                  <div className="rounded-t-lg border border-text-secondary px-2 py-2 sm:rounded-t-lg md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                    <dl className="flex flex-col items-stretch justify-center space-y-4 divide-y divide-text-secondary text-sm text-text-secondary sm:flex-row  md:gap-x-6 md:space-y-0 md:divide-y-0">
                      <div className="flex w-full flex-col justify-start whitespace-pre-wrap md:block">
                        <dt className="whitespace-nowrap text-base font-medium text-text-primary">
                          Order number
                        </dt>
                        <dd className=" whitespace-pre-wrap text-xs md:mt-1">
                          {order.id}
                        </dd>
                      </div>
                      <div className="flex flex-col justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-text-primary">
                          Date placed
                        </dt>
                        <dd className="md:mt-1">
                          <span>{`${moment(order.createdAt).format(
                            "MMM DD, YYYY" + " hh:mm a"
                          )}`}</span>
                        </dd>
                      </div>
                      <div className="flex flex-col justify-between pt-4 font-medium text-text-primary md:block md:pt-0">
                        <dt>Total amount</dt>
                        <dd className="md:mt-1">
                          $
                          {(
                            parseInt(
                              order?.totalMoney?.amount?.toString() as string
                            ) / 100
                          ).toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                      <Link href={`/order/${order.id}` as string}>
                        <a
                          href={`/order/${order.id}`}
                          className="flex w-full items-center justify-center rounded-md border border-text-secondary bg-white py-2 px-4 text-sm font-medium text-text-secondary shadow-sm hover:bg-gray-50 focus:outline-none  md:w-auto"
                        >
                          View Order
                          <span className="sr-only">for order {order.id}</span>
                        </a>
                      </Link>
                    </div>
                  </div>

                  <div className="flow-root rounded-b-lg border border-text-secondary px-4 sm:px-0 ">
                    <div className="-my-6 divide-y divide-text-secondary">
                      {order?.lineItems &&
                        order.lineItems
                          .slice(0, 1)
                          .map((product: OrderLineItem) => {
                            const thisProduct =
                              orderProducts?.products.relatedObjects?.find(
                                (item) =>
                                  item.id === product.catalogObjectId ||
                                  item.itemData?.variations?.[0].id ===
                                    product.catalogObjectId
                              );
                            const categoryName = categories?.find(
                              (category) =>
                                category.id ===
                                orderProducts?.products.relatedObjects?.find(
                                  (item) =>
                                    item.id === product.catalogObjectId ||
                                    item.itemData?.variations?.[0].id ===
                                      product.catalogObjectId
                                )?.itemData?.categoryId
                            )?.categoryData?.name;
                            const productImage = orderProducts?.items?.find(
                              (item) =>
                                item.type === "IMAGE" &&
                                thisProduct?.itemData?.imageIds?.includes(
                                  item.id
                                )
                            )?.imageData?.url;
                            return (
                              <div
                                key={product.uid}
                                className="flex py-6 sm:py-10"
                              >
                                <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                                  <div className="pl-4 lg:flex-1">
                                    <div className="items-center pt-1 sm:flex sm:space-x-2">
                                      <Image
                                        className="h-24 w-24 rounded-full "
                                        height={50}
                                        width={50}
                                        objectFit="cover"
                                        src={
                                          productImage ||
                                          "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                        }
                                        alt={product.name}
                                      />
                                      <h4 className="font-medium text-text-primary">
                                        {product.name}
                                      </h4>
                                      <p className="mt-2 hidden text-sm text-text-secondary sm:block">
                                        {/* {product?.} */}
                                      </p>

                                      <p className="mt-1 font-medium text-text-primary sm:mt-0 sm:ml-6">
                                        $
                                        {(
                                          parseInt(
                                            product?.totalMoney?.amount?.toString() as string
                                          ) / 100
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="mt-2 flex text-sm font-medium sm:mt-2">
                                      {categoryName && (
                                        <>
                                          <a
                                            href={`/shop/${slugify(
                                              categoryName as string
                                            )}/${slugify(
                                              thisProduct?.itemData
                                                ?.name as string
                                            )}`}
                                            className="text-text-primary hover:text-text-secondary"
                                          >
                                            View Product
                                          </a>
                                          <div className="ml-4 border-l border-text-secondary pl-4 sm:ml-6 sm:pl-6">
                                            <button
                                              onClick={() => {
                                                handleAddToCart(
                                                  thisProduct as CatalogObject
                                                );
                                              }}
                                              className="text-text-primary hover:text-text-secondary"
                                            >
                                              Buy Again
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
                {i === 1 && customerOrders.length > 1 && (
                  <div className="flex w-full items-start justify-end text-center">
                    <button
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        setOpenTab(3);
                      }}
                    >
                      <span className="flex w-full items-center justify-end font-gothic text-sm text-text-secondary">
                        View All
                      </span>
                    </button>
                  </div>
                )}
              </Disclosure.Panel>
            ))
          ) : (
            <Disclosure.Panel className="rounded-b-lg border-x border-b border-text-secondary px-4 pt-4 pb-2 text-sm text-text-primary">
              <span>
                No recent orders found.. Find your next favourite goodie{" "}
                <a href="/shop">
                  {" "}
                  <span className="underline decoration-text-secondary decoration-dotted underline-offset-2">
                    now
                  </span>
                </a>
              </span>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default RecentOrders;
