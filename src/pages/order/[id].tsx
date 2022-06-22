import { appRouter } from "@/backend/router/_app";
import { createSSGHelpers } from "@trpc/react/ssg";
import { inferRouterContext } from "@trpc/server";
import {
  GetServerSideProps,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import moment from "moment";
import { BeatLoader } from "react-spinners";

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
  const { id } = router.query;
  const { data: order, status } = trpc.useQuery([
    "getOrder",
    { orderId: id as string },
  ]);
  console.log(order);

  const { data: products } = trpc.useQuery(
    [
      "search-products",
      {
        categoryIds: order?.lineItems?.map((i) => i.catalogObjectId as string),
      },
    ],
    {
      enabled: !!order,
    }
  );
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
    <div className="flex flex-col space-y-2 font-gothic">
      <div className="bg-white sm:p-3 m-2 sm:m-6 sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow shadow-text-primary">
        <div className="px-4 space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 flex-col ">
          <div className="flex sm:items-baseline justify-between sm:space-x-4 w-full">
            <h1 className="text-2xl tracking-tight text-text-primary sm:text-3xl truncate">
              Order #{truncateMiddle(order?.id as string, 10)}
            </h1>
            <a
              href="#"
              className="hidden text-sm font-medium text-text-primary hover:text-text-secondary sm:block"
            >
              Print Order<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
          <p className="text-sm text-text-secondary">
            Order placed{" "}
            {moment(order?.createdAt).format("MMMM Do, YYYY, h:mm a")}
          </p>
          <a
            href="#"
            className="text-sm font-medium text-text-primary hover:text-text-secondary sm:hidden"
          >
            Print Order<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
      <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto text-text-primary font-gothic shadow-text-primary">
        <div className="mt-6">
          <h2 className="sr-only">Products purchased</h2>

          <div className="space-y-8">
            {order?.lineItems?.map((product) => (
              <div
                key={product.catalogObjectId}
                className="bg-white border-t border-b border-gray-200 shadow-sm shadow-text-primary sm:border sm:rounded-lg"
              >
                <div className="py-6 px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                  <div className="sm:flex lg:col-span-7">
                    <div className="flex-shrink-0 w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-none sm:w-40 sm:h-40">
                      {/* <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                      /> */}
                    </div>

                    <div className="mt-6 sm:mt-0 sm:ml-6">
                      <h3 className="text-base font-medium text-text-primary">
                        <a href={product.name}>{product.name}</a>
                      </h3>
                      <div>
                        <span>$</span>
                        <span>{Number(order?.totalMoney?.amount) / 100}</span>
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        {product?.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:col-span-5">
                    <dl className="grid grid-cols-2 gap-x-6 text-sm">
                      <div>
                        <dt className="font-medium text-text-primary">
                          Delivery address
                        </dt>
                        <dd className="mt-3 text-gray-500">
                          <span className="block">
                            {
                              order.fulfillments?.[0].shipmentDetails?.recipient
                                ?.displayName
                            }
                          </span>
                          <span className="block">
                            {
                              order.fulfillments?.[0].shipmentDetails?.recipient
                                ?.address?.addressLine1
                            }
                          </span>
                          <span className="block">
                            {
                              order.fulfillments?.[0].shipmentDetails?.recipient
                                ?.address?.locality
                            }
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-text-primary">
                          Shipping updates
                        </dt>
                        <dd className="mt-3 text-gray-500 space-y-3">
                          <p>{product.name}</p>
                          <p>{product.name}</p>
                          <button
                            type="button"
                            className="font-medium text-text-primary hover:text-text-secondary"
                          >
                            Edit
                          </button>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:p-8">
                  <h4 className="sr-only">Status</h4>
                  <p className="text-sm font-medium text-text-primary">
                    {product.name} on{" "}
                    <time dateTime={order.updatedAt}>{order.updatedAt}</time>
                  </p>
                  {/* <div className="mt-6" aria-hidden="true">
                    <div className="bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-text-primary rounded-full"
                        style={{
                          width: `calc((${product.step} * 2 + 1) / 8 * 100%)`,
                        }}
                      />
                    </div>
                    <div className="hidden sm:grid grid-cols-4 text-sm font-medium text-text-secondary mt-6">
                      <div className="text-text-primary">Order placed</div>
                      <div
                        className={classNames(
                          product.step > 0 ? "text-text-primary" : "",
                          "text-center"
                        )}
                      >
                        Processing
                      </div>
                      <div
                        className={classNames(
                          product.step > 1 ? "text-text-primary" : "",
                          "text-center"
                        )}
                      >
                        Shipped
                      </div>
                      <div
                        className={classNames(
                          product.step > 2 ? "text-text-primary" : "",
                          "text-right"
                        )}
                      >
                        Delivered
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="mt-16">
          <h2 className="sr-only">Billing Summary</h2>

          <div className="bg-bg-tan py-6 px-4 sm:px-6 sm:rounded-lg lg:px-8 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
              <div>
                <dt className="font-medium text-text-primary">
                  Billing address
                </dt>
                <dd className="mt-3 text-gray-500">
                  <span className="block">Floyd Miles</span>
                  <span className="block">7363 Cynthia Pass</span>
                  <span className="block">Toronto, ON N3Y 4H8</span>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-text-primary">
                  Payment information
                </dt>
                <dd className="-ml-4 -mt-1 flex flex-wrap">
                  <div className="ml-4 mt-4 flex-shrink-0">
                    <svg
                      aria-hidden="true"
                      width={36}
                      height={24}
                      viewBox="0 0 36 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-auto"
                    >
                      <rect width={36} height={24} rx={4} fill="#224DBA" />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-text-primary">Ending with 4242</p>
                    <p className="text-text-secondary">Expires 02 / 24</p>
                  </div>
                </dd>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:col-span-5">
              <div className="pb-4 flex items-center justify-between">
                <dt className="text-text-secondary">Subtotal</dt>
                <dd className="font-medium text-text-primary">$72</dd>
              </div>
              <div className="py-4 flex items-center justify-between">
                <dt className="text-text-secondary">Shipping</dt>
                <dd className="font-medium text-text-primary">$5</dd>
              </div>
              <div className="py-4 flex items-center justify-between">
                <dt className="text-text-secondary">Tax</dt>
                <dd className="font-medium text-text-primary">$6.16</dd>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <dt className="font-medium text-text-primary">Order total</dt>
                <dd className="font-medium text-text-primary">$83.16</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetStaticPropsContext
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: context as inferRouterContext<typeof appRouter>,
//     transformer: superjson,
//   });
//   console.log(context);
//   const orderQuery = await ssg.fetchQuery("getOrder", {
//     orderId: context?.params?.id as string,
//   });

//   if (!orderQuery?.id) {
//     return { props: {} };
//   }
//   return { props: { order: ssg.dehydrate() } };
// };
