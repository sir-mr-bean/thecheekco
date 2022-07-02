import { PageTwoOptions } from "@/types/PageOptions";

const PageTwo = ({
  pageTwoOptions,
  setPageTwoOptions,
}: {
  pageTwoOptions: PageTwoOptions;
  setPageTwoOptions: (pageTwoOptions: PageTwoOptions) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col w-full items-center justify-center space-y-2 sm:pt-5">
        <span className="text-sm sm:text-lg text-center">Great!</span>
        <span className="text-sm sm:text-lg text-center">
          Now, which items would you like to see regularly as part of the box:
        </span>
      </div>
      <div className="flex flex-wrap w-full items-center justify-center py-2 sm:pt-5">
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              shampooBar: !pageTwoOptions.shampooBar,
            })
          }
          className={
            pageTwoOptions.shampooBar
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.shampooBar
                ? `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Shampoo Bar
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              conditioner: !pageTwoOptions.conditioner,
            })
          }
          className={
            pageTwoOptions.conditioner
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.conditioner
                ? `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Conditioner
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              bodyWash: !pageTwoOptions.bodyWash,
            })
          }
          className={
            pageTwoOptions.bodyWash
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.bodyWash
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Body Wash
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              bodyButter: !pageTwoOptions.bodyButter,
            })
          }
          className={
            pageTwoOptions.bodyButter
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.bodyButter
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Body Butter
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              soapBar: !pageTwoOptions.soapBar,
            })
          }
          className={
            pageTwoOptions.soapBar
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.soapBar
                ? `absolute inset-x-5 sm:inset-x-12  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-12  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Soap Bars
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              bathSoak: !pageTwoOptions.bathSoak,
            })
          }
          className={
            pageTwoOptions.bathSoak
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.bathSoak
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Bath Soaks
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              bubbleBath: !pageTwoOptions.bubbleBath,
            })
          }
          className={
            pageTwoOptions.bubbleBath
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.bubbleBath
                ? `absolute inset-x-5 sm:inset-x-9  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-9 bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Bubble Bath
          </span>
        </div>
        <div
          onClick={() =>
            setPageTwoOptions({
              ...pageTwoOptions,
              showerSteamer: !pageTwoOptions.showerSteamer,
            })
          }
          className={
            pageTwoOptions.showerSteamer
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageTwoOptions.showerSteamer
                ? `absolute inset-x-1 sm:inset-x-5  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-1 sm:inset-x-5  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Shower Steamers
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageTwo;
