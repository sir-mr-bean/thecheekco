import Link from "next/link";

const deliveryOptions = [
  {
    id: 1,
    name: "Standard Delivery By Australia Post",
    cutoff:
      "Orders placed Monday to Friday before 3pm will be dispatched within 1 business day. Any orders placed after 3pm Monday to Friday will be dispatched within 2 business days. Orders placed after 3pm on a Friday or over the weekend will be dispatched on Monday. Any orders placed during our sale periods may take a little longer and will be dispatched within 3-5 business days.",
    deliveryTime:
      "5-10 business days in metro areas and 5-12 business days in regional areas",
    deliveryCosts: "Minimum $7.95 or Free on orders over $99",
  },
  {
    id: 2,
    name: "Express Delivery By Australia Post",
    cutoff: "As above",
    deliveryTime:
      "1 – 3 business days in metro areas and 1-5 business days in regional areas",
    deliveryCosts: "Minimum $14.95 or Free on orders over $99",
  },
  {
    id: 3,
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
    <div className="bg-white mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary">
      <div className="mx-auto px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <div className="flex flex-col w-full font-gothic space-y-3 px-2 sm:px-10 text-sm sm:text-base">
          <h1 className="text-2xl sm:text-4xl py-4">Shipping Policy</h1>
          <p>
            At this stage, we do not support international delivery however
            we’re happy to accommodate special orders.
          </p>
          <p>
            Reach out to our team{" "}
            <Link href="contact-us">
              <span className="underline cursor-pointer">here</span>
            </Link>{" "}
            to request a special order today.
          </p>
          <p>All orders are currently shipped from FNQ, Australia. </p>
          <p>
            For information on returns, please visit our{" "}
            <Link href="returns">
              <span className="underline cursor-pointer">returns page</span>
            </Link>
          </p>
          <h1 className="text-2xl sm:text-4xl py-4">Delivery Options</h1>
          <p>
            Delivery costs will be calculated at checkout once the delivery
            option and destination has been selected/entered. We offer the below
            delivery options:
          </p>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="-mx-4 mt-8 overflow-hidden shadow shadow-text-primary ring-1 ring-text-secondary ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                <table className="min-w-full divide-y divide-text-secondary">
                  <thead className=" w-full border border-text-secondary">
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
                          <dl className="font-normal lg:hidden">
                            <dt className="sr-only">Cut Off Times</dt>
                            <dd className="mt-1 text-gray-700">
                              Delivery Time: {option.deliveryTime}
                            </dd>
                          </dl>
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-text-secondary sm:table-cell">
                          {option.deliveryTime}
                        </td>
                        <td className="px-3 py-4 text-sm text-text-secondary lg:table-cell">
                          {option.cutoff}{" "}
                          {option.href ? (
                            <Link href={option.href}>
                              <a className="text-text-primary underline cursor-pointer">
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
  );
};

export default ShippingPolicy;
