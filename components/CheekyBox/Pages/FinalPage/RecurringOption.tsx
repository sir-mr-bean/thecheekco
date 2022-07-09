import moment from "moment";

const GiftOption = () => {
  const total = 49.99;
  const pickup = false;
  const shipping = 0;

  const getDaysUntilNextMonth = () => {
    const today = moment();
    const nextMonth = moment().add(1, "month");
    const nextMonth7th = moment(nextMonth).date(7);
    const nextMonth7thCalendar = moment(nextMonth7th).calendar();
    const daysUntilNextMonth = nextMonth7th.diff(today, "days");
    return { daysUntilNextMonth, nextMonth7thCalendar };
  };

  const { daysUntilNextMonth, nextMonth7thCalendar } = getDaysUntilNextMonth();

  return (
    <>
      <div className="flex w-full justify-center border border-y-2 border-y-text-secondary border-x-transparent">
        <span className="py-6 text-center text-sm text-text-secondary sm:text-lg">
          Cheeky Box set to be shipped in {daysUntilNextMonth} days
        </span>
      </div>

      <div className="mx-auto h-min w-full scroll-smooth sm:mx-0 sm:px-8 md:sticky md:top-44">
        <div className="flex h-min w-full flex-col items-center justify-center p-3">
          <h2 className="sr-only">Order summary</h2>
          <table className="inline-flex min-w-full flex-col divide-y rounded-lg border bg-button text-text-primary">
            <thead className="w-full min-w-full ">
              <tr className="flex min-w-full items-center justify-between">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold "
                >
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="min-w-full divide-y divide-gray-200 rounded-b-lg bg-white">
              <tr
                key={0}
                className="mx-1 flex min-w-full items-center justify-between"
              >
                <td className="ml-2 flex flex-nowrap items-center py-4 text-sm font-medium text-text-primary sm:pl-2">
                  {/* <div className="relative h-20 w-20"> */}
                  {/* <Image
                    src={
                      product.productImage ||
                      "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                    }
                    alt={product.itemData?.name}
                    width={75}
                    height={75}
                    layout="fixed"
                    priority={true}
                    className="h-16 w-16 flex-none rounded-md bg-gray-100 object-cover object-center"
                  /> */}
                  {/* </div> */}
                  <div className="flex flex-col pl-2 text-xs">
                    <h3 className="text-text-primary  lg:whitespace-nowrap">
                      <a href={"#"}>Cheeky Box (monthly)</a>
                    </h3>
                    <h3>$49.99/month</h3>
                  </div>
                </td>
                <td className="justify-self-end whitespace-nowrap px-3 py-4 text-sm">
                  1
                </td>
              </tr>
            </tbody>
          </table>

          <dl className="mt-10 w-full space-y-6 text-sm font-medium text-text-primary">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-text-primary">
                ${(total - total * 0.1).toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>GST</dt>
              <dd className="text-text-primary">${(total * 0.1).toFixed(2)}</dd>
            </div>
            {!pickup && (
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-text-primary">
                  {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-text-secondary pt-6 text-text-primary">
              <dt className="text-base">Total</dt>
              <dd className="text-base">
                $
                {pickup
                  ? total.toFixed(2)
                  : !pickup && shipping > 0
                  ? (total + Number(shipping)).toFixed(2)
                  : total.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

export default GiftOption;
