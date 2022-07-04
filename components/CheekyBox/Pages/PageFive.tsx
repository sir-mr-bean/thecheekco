import { PageFiveOptions } from "@/types/PageOptions";

const PageFour = ({
  pageFiveOptions,
  setPageFiveOptions,
}: {
  pageFiveOptions: PageFiveOptions;
  setPageFiveOptions: (PageFiveOptions: PageFiveOptions) => void;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2">
      <span className="text-sm sm:text-lg text-center">
        Awesome, last question:
      </span>
      <span>What type of accesories would excite you the most to recieve?</span>
      <div className="flex flex-wrap w-full items-center justify-center py-2 sm:pt-5">
        <div
          onClick={() =>
            setPageFiveOptions({
              ...pageFiveOptions,
              hair: !pageFiveOptions.hair,
            })
          }
          className={
            pageFiveOptions.hair
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFiveOptions.hair
                ? `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Hair
          </span>
        </div>
        <div
          onClick={() =>
            setPageFiveOptions({
              ...pageFiveOptions,
              skin: !pageFiveOptions.skin,
            })
          }
          className={
            pageFiveOptions.skin
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFiveOptions.skin
                ? `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Skin
          </span>
        </div>
        <div
          onClick={() =>
            setPageFiveOptions({
              ...pageFiveOptions,
              sleep: !pageFiveOptions.sleep,
            })
          }
          className={
            pageFiveOptions.sleep
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFiveOptions.sleep
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Sleep
          </span>
        </div>
        <div
          onClick={() =>
            setPageFiveOptions({
              ...pageFiveOptions,
              home: !pageFiveOptions.home,
            })
          }
          className={
            pageFiveOptions.home
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFiveOptions.home
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Home Decor
          </span>
        </div>
        <div
          onClick={() =>
            setPageFiveOptions({
              ...pageFiveOptions,
              wearable: !pageFiveOptions.wearable,
            })
          }
          className={
            pageFiveOptions.wearable
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFiveOptions.wearable
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Wearable
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageFour;
