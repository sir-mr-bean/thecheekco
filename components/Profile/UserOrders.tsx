/* This example requires Tailwind CSS v2.0+ */

import { LineItem } from "@square/web-sdk";
import { AiOutlineCheck } from "react-icons/ai";
import { Order, OrderLineItem } from "square";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const orders = [
  {
    number: "WU88191111",
    date: "January 22, 2021",
    datetime: "2021-01-22",
    href: "#",
    invoiceHref: "#",
    total: "$302.00",
    products: [
      {
        id: 1,
        name: "Nomad Tumbler",
        description:
          "This durable double-walled insulated tumbler keeps your beverages at the perfect temperature all day long. Hot, cold, or even lukewarm if you're weird like that, this bottle is ready for your next adventure.",
        href: "#",
        price: "$35.00",
        status: "out-for-delivery",
        date: "January 5, 2021",
        datetime: "2021-01-05",
        imageSrc:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-06-product-01.jpg",
        imageAlt:
          "Olive drab green insulated bottle with flared screw lid and flat top.",
      },
      // More products...
    ],
  },
  {
    number: "WU88191112",
    date: "January 22, 2021",
    datetime: "2021-01-22",
    href: "#",
    invoiceHref: "#",
    total: "$302.00",
    products: [
      {
        id: 1,
        name: "Nomad Tumbler",
        description:
          "This durable double-walled insulated tumbler keeps your beverages at the perfect temperature all day long. Hot, cold, or even lukewarm if you're weird like that, this bottle is ready for your next adventure.",
        href: "#",
        price: "$35.00",
        status: "out-for-delivery",
        date: "January 5, 2021",
        datetime: "2021-01-05",
        imageSrc:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-06-product-01.jpg",
        imageAlt:
          "Olive drab green insulated bottle with flared screw lid and flat top.",
      },
      // More products...
    ],
  },
  // More orders...
];

const UserOrders = ({ customerOrders }) => {
  console.log("customerOrders is ", customerOrders);
  return (
    <div>
      <div className="flex flex-col space-y-2">
        <div className="bg-white sm:p-3 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow">
          <div className="max-w-4xl mx-auto py-3 sm:px-6 sm:py-4">
            <div className="px-4 sm:px-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                Order history
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Check the status of recent orders, manage returns, and download
                invoices.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white sm:p-6 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg">
          <div className="mt-16">
            <h2 className="sr-only">Recent orders</h2>

            <div className="space-y-16 sm:space-y-24 divide-y divide-text-primary px-2">
              {customerOrders &&
                customerOrders.map((order: Order) => (
                  <div key={order.id}>
                    <h3 className="sr-only">
                      Order placed on{" "}
                      <time dateTime={order.createdAt}>{order.createdAt}</time>
                    </h3>

                    <div className=" px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                      <dl className="divide-y divide-text-secondary space-y-4 text-sm text-text-secondary flex-auto md:divide-y-0 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8">
                        <div className="flex justify-between md:block">
                          <dt className="font-medium text-text-primary">
                            Order number
                          </dt>
                          <dd className="md:mt-1">{order.id}</dd>
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
                      <div className="space-y-4 mt-6 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                        <a
                          href={order.id}
                          className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                        >
                          View Order
                          <span className="sr-only">{order.id}</span>
                        </a>
                        <a
                          href={order.id}
                          className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                        >
                          View Invoice
                          <span className="sr-only">for order {order.id}</span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                      <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                        {customerOrders?.lineItems &&
                          customerOrders.lineItems.map(
                            (product: OrderLineItem) => (
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
                                        <p className="hidden mt-2 text-sm text-text-secondary sm:block">
                                          /description here
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
                                      <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
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
                                <div className="ml-4 flex-shrink-0 sm:m-0 sm:mr-6 sm:order-first">
                                  {/* <img
                                    src={product.}
                                    alt={product.imageAlt}
                                    className="col-start-2 col-end-3 sm:col-start-1 sm:row-start-1 sm:row-span-2 w-20 h-20 rounded-lg object-center object-cover sm:w-40 sm:h-40 lg:w-52 lg:h-52"
                                  /> */}
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
