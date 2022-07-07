/* This example requires Tailwind CSS v2.0+ */

import { LineItem } from "@square/web-sdk";
import Link from "next/link";
import { AiOutlineCheck } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import { Order, OrderLineItem } from "square";

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
              <div className="mx-auto max-w-4xl py-3 sm:px-6 sm:py-4">
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

                        <div className=" border border-text-secondary px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                          <dl className="flex space-y-4 divide-y divide-text-secondary text-sm text-text-secondary  md:gap-x-6 md:space-y-0 md:divide-y-0">
                            <div className="flex w-full justify-between whitespace-pre-wrap md:block">
                              <dt className="text-base font-medium text-text-primary">
                                Order number
                              </dt>
                              <dd className=" whitespace-pre-wrap text-xs md:mt-1">
                                {order.id}
                              </dd>
                            </div>
                            <div className="flex justify-between pt-4 md:block md:pt-0">
                              <dt className="font-medium text-text-primary">
                                Date placed
                              </dt>
                              <dd className="md:mt-1">
                                <time dateTime={order.createdAt}>
                                  {order.createdAt}
                                </time>
                              </dd>
                            </div>
                            <div className="flex justify-between pt-4 font-medium text-text-primary md:block md:pt-0">
                              <dt>Total amount</dt>
                              <dd className="md:mt-1">
                                {parseInt(
                                  order?.totalMoney?.amount?.toString() as string
                                ) / 100}
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
                                <span className="sr-only">
                                  for order {order.id}
                                </span>
                              </a>
                            </Link>
                          </div>
                        </div>

                        <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                          <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                            {order?.lineItems &&
                              order.lineItems.map((product: OrderLineItem) => {
                                console.log(product);
                                return (
                                  <div
                                    key={product.uid}
                                    className="flex py-6 sm:py-10"
                                  >
                                    <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                                      <div className="lg:flex-1">
                                        <div className="sm:flex">
                                          <div>
                                            <h4 className="font-medium text-text-primary">
                                              {product.name}
                                            </h4>
                                            <p className="mt-2 hidden text-sm text-text-secondary sm:block">
                                              {/* {product?.} */}
                                            </p>
                                          </div>
                                          <p className="mt-1 font-medium text-text-primary sm:mt-0 sm:ml-6">
                                            {parseInt(
                                              product?.totalMoney?.amount?.toString() as string
                                            ) / 100}
                                          </p>
                                        </div>
                                        <div className="mt-2 flex text-sm font-medium sm:mt-4">
                                          <a
                                            href={product.uid}
                                            className="text-text-primary hover:text-text-secondary"
                                          >
                                            View Product
                                          </a>
                                          <div className="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
                                            <a
                                              href="#"
                                              className="text-text-primary hover:text-text-secondary"
                                            >
                                              Buy Again
                                            </a>
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
