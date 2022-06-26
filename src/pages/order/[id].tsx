import { useRouter } from "next/router";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import moment from "moment";
import { BeatLoader } from "react-spinners";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function truncateMiddle(str: string, length: number) {
  if (str?.length <= length) {
    return str;
  }
  const half = Math.floor(length / 2);
  return str.substring(0, half) + "..." + str.substring(str.length - half);
}

const UserDashboard = () => {
  const router = useRouter();
  const { id, success } = router.query;
  console.log(success);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    if (success) {
      setBannerOpen(true);
    }
  }, [success]);

  const { data: order, status } = trpc.useQuery([
    "getOrder",
    { orderId: id as string },
  ]);
  console.log(order);

  const { data: productsQuery } = trpc.useQuery(
    [
      "search-products-by-ids",
      {
        productIds: order?.lineItems?.map((i) => i.catalogObjectId as string),
      },
    ],
    {
      enabled: !!order,
    }
  );
  const products = productsQuery?.products.relatedObjects;
  const images = productsQuery?.images;
  console.log(products);
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
        <BeatLoader
          color="#602d0d"
          loading={status === String("loading")}
          size={20}
        />
      </div>
    );
  }

  return (
    <>
      {bannerOpen && (
        <div className="bg-text-secondary rounded-xl m-2">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-text-primary">
                  <AiOutlineCheck
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
                <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">We announced a new product!</span>
                  <span className="hidden md:inline">
                    Thanks for your order! You will soon receive an email with
                    your order details.
                  </span>
                </p>
              </div>

              <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                <button
                  onClick={() => {
                    setBannerOpen(false);
                  }}
                  type="button"
                  className="-mr-1 flex p-2 rounded-md hover:bg-text-primary focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                >
                  <span className="sr-only">Dismiss</span>
                  <AiOutlineClose
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      return (
      <>
        {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
        <main className="relative lg:min-h-full">
          <div className="h-80 overflow-hidden lg:absolute lg:w-1/2 lg:h-full lg:pr-4 xl:pr-12">
            <img
              src="https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg"
              alt="TODO"
              className="h-full w-full object-center object-cover"
            />
          </div>

          <div>
            <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:py-32 lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-24">
              <div className="lg:col-start-2">
                <h1 className="text-sm font-medium text-text-secondary">
                  Payment successful
                </h1>
                <p className="mt-2 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
                  Thanks for ordering
                </p>
                <p className="mt-2 text-base text-text-secondary">
                  We appreciate your order, we’re currently processing it. Hang
                  tight and we’ll send you confirmation very soon!
                </p>

                <dl className="mt-16 text-sm font-medium">
                  <dt className="text-text-primary">Tracking number</dt>
                  <dd className="mt-2 text-text-secondary">
                    {order?.id?.toLocaleUpperCase()}
                  </dd>
                </dl>

                <ul
                  role="list"
                  className="mt-6 text-sm font-medium text-text-secondary border-t border-gray-200 divide-y divide-gray-200"
                >
                  {products &&
                    products.map((product) => {
                      const productImage = images?.find(
                        (p) =>
                          p.type === "IMAGE" &&
                          product.itemData?.imageIds?.includes(p.id)
                      );
                      return (
                        <li key={product.id} className="flex py-6 space-x-6">
                          <img
                            src={
                              productImage?.imageData?.url ||
                              "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                            }
                            alt={product.itemData?.name}
                            className="flex-none w-24 h-24 bg-gray-100 rounded-md object-center object-cover"
                          />
                          <div className="flex-auto space-y-1">
                            <h3 className="text-text-primary">
                              <a href="#">{product.itemData?.name}</a>
                            </h3>
                            {/* <p>{product.color}</p>
                      <p>{product.size}</p> */}
                          </div>
                          <p className="flex-none font-medium text-text-primary">{`$ ${(
                            Number(
                              product.itemData?.variations?.[0]
                                .itemVariationData?.priceMoney?.amount
                            ) / 100
                          ).toFixed(2)}`}</p>
                        </li>
                      );
                    })}
                </ul>

                <dl className="text-sm font-medium text-text-secondary space-y-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="text-text-primary">
                      $
                      {(
                        Number(order?.totalMoney?.amount) / 100 -
                        (Number(order?.totalMoney?.amount) / 100) * 0.1
                      ).toFixed(2)}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="text-text-primary">$8.00</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Taxes</dt>
                    <dd className="text-text-primary">
                      $
                      {(
                        (Number(order?.totalMoney?.amount) / 100) *
                        0.1
                      ).toFixed(2)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 text-text-primary pt-6">
                    <dt className="text-base">Total</dt>
                    <dd className="text-base">{`$${(
                      Number(order?.totalMoney?.amount) / 100
                    ).toFixed(2)}`}</dd>
                  </div>
                </dl>

                <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                  <div>
                    {order?.fulfillments?.[0].type === "SHIPMENT" ? (
                      <>
                        <dt className="font-medium text-text-primary">
                          Shipping Address
                        </dt>
                        <dd className="mt-2">
                          <address className="not-italic">
                            <span className="block">
                              {
                                order.fulfillments?.[0]?.shipmentDetails
                                  ?.recipient?.displayName
                              }
                            </span>
                            <span className="block">
                              {
                                order.fulfillments?.[0]?.shipmentDetails
                                  ?.recipient?.address?.addressLine1
                              }
                            </span>
                            <span className="block">
                              {
                                order.fulfillments?.[0]?.shipmentDetails
                                  ?.recipient?.address?.locality
                              }
                            </span>
                            <span className="block">
                              {
                                order.fulfillments?.[0]?.shipmentDetails
                                  ?.recipient?.address?.country
                              }
                            </span>
                          </address>
                        </dd>
                      </>
                    ) : (
                      <>
                        <dt className="font-medium text-text-primary">
                          Pickup From:
                        </dt>
                        <dd className="mt-2">
                          <address className="not-italic">
                            <span className="block">The Cheek Co</span>
                            <span className="block">
                              9 Shields Street Cairns
                            </span>
                          </address>
                        </dd>
                      </>
                    )}
                  </div>
                  <div>
                    <dt className="font-medium text-text-primary">
                      Payment Information
                    </dt>
                    <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                      <div className="flex-none">
                        {order?.tenders?.[0]?.cardDetails?.card?.cardBrand ===
                          "VISA" && (
                          <>
                            <svg
                              aria-hidden="true"
                              width={36}
                              height={24}
                              viewBox="0 0 36 24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-auto"
                            >
                              <rect
                                width={36}
                                height={24}
                                rx={4}
                                fill="#224DBA"
                              />
                              <path
                                d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                                fill="#fff"
                              />
                            </svg>
                            <p className="sr-only">Visa</p>
                          </>
                        )}
                      </div>
                      <div className="flex-auto">
                        <p className="text-text-primary">
                          Ending with{" "}
                          {order?.tenders?.[0].cardDetails?.card?.last4}
                        </p>
                      </div>
                    </dd>
                  </div>
                </dl>

                <div className="mt-16 border-t border-gray-200 py-6 text-right">
                  <a
                    href="#"
                    className="text-sm font-medium text-text-secondary hover:text-text-primary"
                  >
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
      )
    </>
  );
};

export default UserDashboard;
