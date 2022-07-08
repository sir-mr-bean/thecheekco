const SubscrinOn = ({
  price,
  duration,
}: {
  price: string;
  duration: string;
}) => {
  return (
    <div className="group h-[370px]  w-full max-w-xs rounded-xl bg-button shadow-sm sm:h-[460px] ">
      <div className="flex h-full w-full flex-col items-center justify-between p-2 sm:p-6">
        <span className=" text-center text-2xl text-text-primary sm:text-4xl">
          the cheeky box.
        </span>
        {duration === "monthly" ? (
          <span className="text-base text-text-primary sm:text-lg">
            monthly subscrin box
          </span>
        ) : (
          <span className="text-base text-text-primary sm:text-lg">
            3 month gift addition
          </span>
        )}
        <div className="flex w-full flex-col items-center justify-center">
          <span className=" text-2xl text-text-primary sm:text-3xl">
            {price}
          </span>
          {duration === "monthly" ? (
            <span className="text-xs text-text-primary">
              (billed monthly, postage included)
            </span>
          ) : (
            <span className="text-xs text-text-primary">
              (one off payment, postage included)
            </span>
          )}
        </div>
        {duration === "monthly" ? (
          <div className="flex flex-col items-center justify-center text-center text-xs text-text-primary sm:text-sm">
            <span className="">
              This little box of luxury a collection of locally handmade,
              plastic free and fabulous products.
            </span>
            <span className="">
              Each month will sport a selection of soap, skin care, shower & or
              bath, & accessories.
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-xs text-text-primary sm:text-sm">
            <span className="">
              The gift that keeps on giving, pamper a loved one with care &
              convenience. This box will arrive at the beginning of the month
              for 3 months. No fuss, just beautiful handmade products at their
              door.
            </span>
          </div>
        )}
        <span className="pb-1 text-center text-xs text-text-primary">
          Subscription boxes will be shipped at the beginning of the next
          calender month.
        </span>
        {duration === "monthly" ? (
          <div className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-xl border border-transparent bg-bg-tan py-3 hover:border-white">
            <span className="text-base font-semibold text-text-primary">
              Select
            </span>
          </div>
        ) : (
          <div className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl border border-transparent bg-bg-tan py-3 hover:border-white">
            <span className="text-base font-semibold text-text-primary">
              Send a gift
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscrinOn;
