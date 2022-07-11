import { CartState } from "@/context/Cart/Context";
import { slugify } from "@/utils/hooks/useSlugify";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { CatalogObject, Order, OrderLineItem } from "square";
import moment from "moment";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const UserOrders = ({
  customerOrders,
  orderQueryStatus,
}: {
  customerOrders: Order[];
  orderQueryStatus: string;
}) => {
  const { dispatch: dispatchCart } = CartState();
  const productIDs = [
    ...new Set(
      customerOrders
        ?.map(
          (order) =>
            order.lineItems?.map((item) => item.catalogObjectId as string) ?? []
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
    <>
      {orderQueryStatus !== "success" ? (
        <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
          <div className="mx-auto flex h-screen w-full items-center justify-center  text-text-primary">
            <BeatLoader
              color="#602d0d"
              loading={orderQueryStatus === String("loading")}
              size={20}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col space-y-2">
            <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
              <div className="max-w-4xl py-3 sm:px-6 sm:py-4">
                <div className="px-4 sm:px-0">
                  <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                    Order history
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    Check the status of recent orders, manage returns, and
                    download invoices.
                  </p>
                </div>
              </div>
            </div>
            <div className="m-2 rounded-md bg-white font-gothic sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
              <div className="mt-16">
                <h2 className="sr-only">Recent orders</h2>

                <div className="space-y-16 divide-y divide-text-primary px-2 sm:space-y-24">
                  {customerOrders &&
                    customerOrders.map((order: Order) => (
                      <div key={order.id}>
                        <h3 className="sr-only">
                          Order placed on{" "}
                          <time dateTime={order.createdAt}>
                            {order.createdAt}
                          </time>
                        </h3>

                        <div className="rounded-lg border border-text-secondary px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                          <dl className="flex flex-col divide-y divide-text-secondary text-sm text-text-secondary sm:flex-row sm:space-y-4  md:gap-x-6 md:space-y-0 md:divide-y-0">
                            <div className="flex w-full justify-between whitespace-pre-wrap md:block">
                              <dt className="text-base font-medium text-text-primary">
                                Order number
                              </dt>
                              <dd className=" whitespace-pre-wrap text-xs md:mt-1">
                                {order.id}
                              </dd>
                            </div>
                            <div className="flex justify-between pt-4">
                              <dt className="font-medium text-text-primary">
                                Date placed
                              </dt>
                              <dd className="md:mt-1">
                                <span>
                                  {`${moment(order.createdAt).format(
                                    "MMM DD, YYYY" + " hh:mm a"
                                  )}`}
                                </span>
                              </dd>
                            </div>
                            <div className="flex justify-between pt-4 font-medium text-text-primary md:block md:pt-0">
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
                                <span className="sr-only">
                                  for order {order.id}
                                </span>
                              </a>
                            </Link>
                          </div>
                        </div>

                        <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                          <div className="-my-6 sm:-my-10">
                            {order?.lineItems &&
                              order.lineItems.map((product: OrderLineItem) => {
                                const thisProduct =
                                  orderProducts?.products.relatedObjects?.find(
                                    (item) =>
                                      item.id === product.catalogObjectId ||
                                      item.itemData?.variations?.[0].id ===
                                        product.catalogObjectId
                                  );
                                console.log();
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
                                      <div className="lg:flex-1">
                                        <div className="items-center sm:flex sm:space-x-2">
                                          <Image
                                            className="h-24 w-24 rounded-full"
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
                                        <div className="mt-2 flex text-sm font-medium sm:mt-4">
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
                                          <div className="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
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
                                        </div>
                                      </div>
                                      {/* <div className="mt-6 font-medium">
                                    {product.status === "delivered" ? (
                                      <div className="flex space-x-2">
                                        <AiOutlineCheck
                                          className="flex-none w-6 h-6 text-green-500"
                                          aria-hidden="true"
                                        />
                                        <p>
                                          Delivered
                                          <span className="hidden sm:inline">
                                            {" "}
                                            on{" "}
                                            <time dateTime={product.}>
                                              {product.date}
                                            </time>
                                          </span>
                                        </p>
                                      </div>
                                    ) : product.status ===
                                      "out-for-delivery" ? (
                                      <p className="text-text-primary">
                                        Out for delivery
                                      </p>
                                    ) : product.status === "cancelled" ? (
                                      <p className="text-text-secondary">
                                        Cancelled
                                      </p>
                                    ) : null}
                                    </div> */}
                                    </div>
                                    <div className="ml-4 flex-shrink-0 sm:order-first sm:m-0 sm:mr-6">
                                      {/* <img
                                    src={product.}
                                    alt={product.imageAlt}
                                    className="col-start-2 col-end-3 sm:col-start-1 sm:row-start-1 sm:row-span-2 w-20 h-20 rounded-lg object-center object-cover sm:w-40 sm:h-40 lg:w-52 lg:h-52"
                                  /> */}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrders;
