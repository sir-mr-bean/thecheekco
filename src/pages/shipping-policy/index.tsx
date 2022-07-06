import Head from "next/head";
import Link from "next/link";

const deliveryOptions = [
  {
    id: 1,
    name: "Standard Delivery By Australia Post",
    cutoff:
      "Please allow 1-2 days for processing. You will recieve a confirmation email once your order has been shipped.",
    deliveryTime:
      "5-10 business days in metro areas and 5-12 business days in regional areas",
    deliveryCosts: "Minimum $9.30 or Free on orders over $100",
  },
  {
    id: 2,
    name: "Special Orders",
    cutoff: "Special orders will be assessed on a case by case basis by day.",
    deliveryTime:
      "One of our team members who will contact you directly within 1 business day.",
    deliveryCosts: "Shipping estimate will be supplied upon application.",
    href: "/special-order-request",
  },
];

const ShippingPolicy = () => {
  return (
    <>
      <Head>
        <title>The Cheek Co. - Shipping Policy</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-1 mt-16 rounded-lg bg-white font-gothic  text-text-primary shadow-sm shadow-black md:mx-16">
        <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
          <div className="flex w-full flex-col space-y-3 px-2 font-gothic text-sm sm:px-10 sm:text-base">
            <h1 className="py-4 text-2xl sm:text-4xl">Shipping Policy</h1>
            <p>
              At this stage, we do not support international delivery however
              we’re happy to accommodate special orders.
            </p>
            <p>
              Reach out to our team{" "}
              <Link href="contact-us">
                <span className="cursor-pointer font-semibold underline">
                  here
                </span>
              </Link>{" "}
              to request a special order today.
            </p>
            <p>All orders are currently shipped from FNQ, Australia. </p>
            <p>
              For information on returns, please visit our{" "}
              <Link href="returns">
                <span className="cursor-pointer font-semibold underline">
                  returns page
                </span>
              </Link>
            </p>
            <h1 className="py-4 text-2xl sm:text-4xl">Delivery Options</h1>
            <p>
              Delivery costs will be calculated at checkout once the delivery
              option and destination has been selected/entered. We offer the
              below delivery options:
            </p>
            <div className="">
              <div className="sm:flex sm:items-center">
                <div className="-mx-4 mt-8 overflow-hidden rounded-xl shadow shadow-text-secondary sm:-mx-6 md:mx-0">
                  <table className="min-w-full divide-y divide-text-secondary">
                    <thead className=" w-full">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-6"
                        >
                          Delivery Options
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-text-primary sm:table-cell"
                        >
                          Delivery Times
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary lg:table-cell"
                        >
                          Cut Off Times
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-6"
                        >
                          Delivery Costs
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text-secondary bg-white">
                      {deliveryOptions.map((option) => (
                        <tr key={option.id}>
                          <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-text-primary sm:w-auto sm:max-w-none sm:pl-6">
                            {option.name}
                            <dl className="font-medium lg:hidden">
                              <dt className="sr-only">Cut Off Times</dt>
                              <dd className="mt-1 text-text-secondary">
                                Delivery Time: {option.deliveryTime}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden px-3 py-4 text-sm text-text-secondary sm:table-cell">
                            {option.deliveryTime}
                          </td>
                          <td className="px-3 py-4 text-sm text-text-secondary lg:table-cell">
                            {option.cutoff}
                            {option.href ? (
                              <Link href={option.href}>
                                <a className="cursor-pointer pl-1 font-semibold text-text-primary underline">
                                  Apply here
                                </a>
                              </Link>
                            ) : null}
                          </td>
                          <td className="px-3 py-4 text-sm text-text-secondary">
                            {option.deliveryCosts}
                          </td>
                          <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
