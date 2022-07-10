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

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const RecentOrders = ({
  customerOrders,
}: {
  customerOrders: Order[] | undefined;
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
  console.log(productIDs);
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
      {customerOrders &&
        categories &&
        customerOrders.slice(0, 2).map((order: Order) => (
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
                  <dt className="font-medium text-text-primary">Date placed</dt>
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
                    href={order.id}
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
                  order.lineItems.slice(0, 1).map((product: OrderLineItem) => {
                    console.log(product);
                    console.log(categories);
                    console.log(orderProducts);
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
                        thisProduct?.itemData?.imageIds?.includes(item.id)
                    )?.imageData?.url;
                    console.log(productImage);

                    console.log(categoryName);
                    return (
                      <div key={product.uid} className="flex py-6 sm:py-10">
                        <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                          <div className="pl-4 lg:flex-1">
                            <div className="sm:flex">
                              <div>
                                <h4 className="text-sm font-medium text-text-primary sm:text-base">
                                  {product.name}
                                </h4>
                                <p className="mt-2 hidden text-sm text-text-secondary sm:block">
                                  {/* {product?.} */}
                                </p>
                              </div>
                              <p className="mt-1 text-sm font-medium text-text-primary sm:mt-0 sm:ml-6 sm:text-base">
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
                                    )}/${slugify(product.name as string)}`}
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
                                      Add to Cart
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
        ))}
    </>
  );
};

export default RecentOrders;
