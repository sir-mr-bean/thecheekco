import { PageFourOptions } from "@/types/PageOptions";

const PageFour = ({
  pageFourOptions,
  setPageFourOptions,
}: {
  pageFourOptions: PageFourOptions;
  setPageFourOptions: (PageFourOptions: PageFourOptions) => void;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2">
      <span className="text-sm sm:text-lg text-center">Almost there!</span>
      <span>How would you identify your skin?</span>
      <div className="flex flex-wrap w-full items-center justify-center py-2 sm:pt-5">
        <div
          onClick={() =>
            setPageFourOptions({
              ...pageFourOptions,
              dry: !pageFourOptions.dry,
            })
          }
          className={
            pageFourOptions.dry
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFourOptions.dry
                ? `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Dry
          </span>
        </div>
        <div
          onClick={() =>
            setPageFourOptions({
              ...pageFourOptions,
              oily: !pageFourOptions.oily,
            })
          }
          className={
            pageFourOptions.oily
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFourOptions.oily
                ? `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Oily
          </span>
        </div>
        <div
          onClick={() =>
            setPageFourOptions({
              ...pageFourOptions,
              normal: !pageFourOptions.normal,
            })
          }
          className={
            pageFourOptions.normal
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFourOptions.normal
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Regular
          </span>
        </div>
        <div
          onClick={() =>
            setPageFourOptions({
              ...pageFourOptions,
              mix: !pageFourOptions.mix,
            })
          }
          className={
            pageFourOptions.mix
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageFourOptions.mix
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Mixed
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageFour;
