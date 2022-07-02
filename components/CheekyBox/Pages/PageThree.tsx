import { PageThreeOptions } from "@/types/PageOptions";

const PageThree = ({
  pageThreeOptions,
  setPageThreeOptions,
}: {
  pageThreeOptions: PageThreeOptions;
  setPageThreeOptions: (PageThreeOptions: PageThreeOptions) => void;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2">
      <span className="text-sm sm:text-lg text-center">Fantastic!</span>
      <span>Are there any scents you prefer?</span>
      <div className="flex flex-wrap w-full items-center justify-center py-2 sm:pt-5">
        <div
          onClick={() =>
            setPageThreeOptions({
              ...pageThreeOptions,
              sweet: !pageThreeOptions.sweet,
            })
          }
          className={
            pageThreeOptions.sweet
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageThreeOptions.sweet
                ? `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-4 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Sweet
          </span>
        </div>
        <div
          onClick={() =>
            setPageThreeOptions({
              ...pageThreeOptions,
              fruity: !pageThreeOptions.fruity,
            })
          }
          className={
            pageThreeOptions.fruity
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageThreeOptions.fruity
                ? `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-6 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Fruity
          </span>
        </div>
        <div
          onClick={() =>
            setPageThreeOptions({
              ...pageThreeOptions,
              masculine: !pageThreeOptions.masculine,
            })
          }
          className={
            pageThreeOptions.masculine
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageThreeOptions.masculine
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Masculine
          </span>
        </div>
        <div
          onClick={() =>
            setPageThreeOptions({
              ...pageThreeOptions,
              floral: !pageThreeOptions.floral,
            })
          }
          className={
            pageThreeOptions.floral
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageThreeOptions.floral
                ? `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-10  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Floral
          </span>
        </div>
        <div
          onClick={() =>
            setPageThreeOptions({
              ...pageThreeOptions,
              fragranceFree: !pageThreeOptions.fragranceFree,
            })
          }
          className={
            pageThreeOptions.fragranceFree
              ? `relative border border-text-secondary bg-button w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
              : `relative border border-text-secondary bg-bg-tan w-32 h-16 sm:w-48 sm:h-24 xl:w-64 xl:h-32 p-3 rounded-lg cursor-pointer hover:scale-[1.01] m-1.5`
          }
        >
          <span
            className={
              pageThreeOptions.fragranceFree
                ? `absolute inset-x-5 sm:inset-x-8  bottom-1 lg:bottom-3 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-text-primary font-semibold`
                : `absolute inset-x-5 sm:inset-x-8  bottom-1 lg:bottom-3 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 text-xs sm:text-sm sm:px-4 sm:pt-2 text-white font-semibold`
            }
          >
            Fragrance Free
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageThree;
