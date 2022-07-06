import type { PageOneOptions } from "@/types/PageOptions";

const PageOne = ({
  pageOneOptions,
  setPageOneOptions,
}: {
  pageOneOptions: PageOneOptions;
  setPageOneOptions: (pageOneOptions: PageOneOptions) => void;
}) => {
  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center">
        <div className="flex w-full flex-col items-center justify-center space-y-3">
          <span className="text-center text-sm sm:text-lg">
            To begin, tell us a little about your bathing & skin preferences to
            help shape each months selections.
          </span>
          <span className="text-center text-sm sm:text-lg">
            Would you prefer: Bath Products, Shower Products or Both
          </span>
        </div>
        <div className="flex w-full items-center justify-between space-x-4 py-2 sm:px-5 sm:pt-5">
          <div
            onClick={() =>
              setPageOneOptions({
                bathProducts: true,
                showerProducts: false,
                both: false,
              })
            }
            className={
              pageOneOptions.bathProducts
                ? `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-button p-3 hover:scale-[1.01]`
                : `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-bg-tan p-3 hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.bathProducts
                  ? `absolute inset-x-[22px] bottom-8  w-fit rounded-lg border border-text-secondary bg-bg-tan px-2 py-1 font-semibold text-text-primary sm:inset-x-[58px] sm:px-4 sm:pt-2`
                  : `absolute inset-x-[22px] bottom-8  w-fit rounded-lg border border-text-secondary bg-button px-2 py-1 font-semibold text-white sm:inset-x-[58px] sm:px-4 sm:pt-2`
              }
            >
              Bath
            </span>
          </div>
          <div
            onClick={() =>
              setPageOneOptions({
                bathProducts: false,
                showerProducts: true,
                both: false,
              })
            }
            className={
              pageOneOptions.showerProducts
                ? `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-button p-3 hover:scale-[1.01]`
                : `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-bg-tan p-3 hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.showerProducts
                  ? `absolute inset-x-3 bottom-8  w-fit rounded-lg border border-text-secondary bg-bg-tan px-2 py-1 font-semibold text-text-primary sm:inset-x-[58px] sm:px-4 sm:pt-2`
                  : `absolute inset-x-3 bottom-8  w-fit rounded-lg border border-text-secondary bg-button px-2 py-1 font-semibold text-white sm:inset-x-[58px] sm:px-4 sm:pt-2`
              }
            >
              Shower
            </span>
          </div>
          <div
            onClick={() =>
              setPageOneOptions({
                bathProducts: false,
                showerProducts: false,
                both: true,
              })
            }
            className={
              pageOneOptions.both
                ? `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-button p-3 hover:scale-[1.01]`
                : `relative h-64 w-full cursor-pointer rounded-lg border border-text-secondary bg-bg-tan p-3 hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.both
                  ? `absolute inset-x-5 bottom-8  w-fit rounded-lg border border-text-secondary bg-bg-tan px-2 py-1 font-semibold text-text-primary sm:inset-x-[58px] sm:px-4 sm:pt-2`
                  : `absolute inset-x-5 bottom-8  w-fit rounded-lg border border-text-secondary bg-button px-2 py-1 font-semibold text-white sm:inset-x-[58px] sm:px-4 sm:pt-2`
              }
            >
              Both
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageOne;
