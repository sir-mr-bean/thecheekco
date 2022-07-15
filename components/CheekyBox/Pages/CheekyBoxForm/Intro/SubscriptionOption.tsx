import { IntroOptions } from "@/types/PageOptions";
import CornerRibbon from "react-corner-ribbon";

const SubscriptionOption = ({
  price,
  duration,
  introOptions,
  setIntroOptions,
  nextStepRef,
  soldOut,
}: {
  price: string;
  duration: string;
  introOptions: IntroOptions;
  setIntroOptions: (options: IntroOptions) => void;
  nextStepRef: React.RefObject<HTMLButtonElement>;
  soldOut: boolean;
}) => {
  return (
    <div
      onClick={() => {
        nextStepRef?.current?.scrollIntoView();
        setTimeout(() => {
          nextStepRef?.current?.focus();
        }, 500);
        setIntroOptions({ duration: duration as IntroOptions["duration"] });
      }}
      className={
        introOptions.duration === duration
          ? `relative h-[370px]  w-full max-w-xs cursor-pointer rounded-xl bg-button shadow-sm shadow-text-secondary ring-2 ring-text-secondary sm:h-[460px]`
          : `relative h-[370px]  w-full max-w-xs cursor-pointer rounded-xl bg-button shadow-sm shadow-text-secondary sm:h-[460px]`
      }
    >
      {soldOut && (
        <CornerRibbon
          position="top-right" // OPTIONAL, default as "top-right"
          fontColor="#f0f0f0" // OPTIONAL, default as "#f0f0f0"
          backgroundColor="#a75e2f" // OPTIONAL, default as "#2c7"
          containerStyle={{}} // OPTIONAL, style of the ribbon
          style={{}} // OPTIONAL, style of ribbon content
          className="font-gothic" // OPTIONAL, css class of ribbon
        >
          Out of Stock
        </CornerRibbon>
      )}
      <div className="flex h-full w-full select-none flex-col items-center justify-between p-2 sm:p-6">
        <span className=" pt-4 text-center text-2xl text-text-primary sm:text-4xl">
          the cheeky box.
        </span>
        {duration === "monthly" ? (
          <span className="text-base text-text-primary sm:text-lg">
            monthly subscription box
          </span>
        ) : (
          <span className="text-base text-text-primary sm:text-lg">
            3 month gift edition
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
              This little box of luxury is a collection of locally handmade,
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
          <div className="mt-1 mb-1 flex w-full cursor-pointer items-center justify-center rounded-xl border border-transparent bg-bg-tan py-3 hover:border-white">
            <span className="text-base font-semibold text-text-primary">
              Select
            </span>
          </div>
        ) : (
          <div className="mb-1 flex w-full cursor-pointer items-center justify-center rounded-xl border border-transparent bg-bg-tan py-3 hover:border-white">
            <span className="text-base font-semibold text-text-primary">
              Send a gift
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionOption;
