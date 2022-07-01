const PageOne = ({ pageOneOptions, setPageOneOptions }) => {
  return (
    <>
      <div className="flex flex-col items-start w-full h-full justify-center">
        <div className="flex flex-col space-y-3 items-center justify-center">
          <span className="text-sm sm:text-lg text-center">
            To begin, tell us a little about your bathing & skin preferences.
          </span>
          <span className="text-sm sm:text-lg text-center">
            Would you prefer: Bath Products, Shower Products or Both
          </span>
        </div>
        <div className="flex w-full items-center justify-between space-x-4 sm:px-5 py-2 sm:pt-5">
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
                ? `relative border border-text-secondary bg-button w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
                : `relative border border-text-secondary bg-bg-tan w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.bathProducts
                  ? `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-text-primary font-semibold`
                  : `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-white font-semibold`
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
                ? `relative border border-text-secondary bg-button w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
                : `relative border border-text-secondary bg-bg-tan w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.showerProducts
                  ? `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-text-primary font-semibold`
                  : `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-white font-semibold`
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
                ? `relative border border-text-secondary bg-button w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
                : `relative border border-text-secondary bg-bg-tan w-full h-64 p-3 rounded-lg cursor-pointer hover:scale-[1.01]`
            }
          >
            <span
              className={
                pageOneOptions.both
                  ? `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-bg-tan border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-text-primary font-semibold`
                  : `absolute inset-x-2 sm:inset-x-[58px]  bottom-8 rounded-lg bg-button border border-text-secondary w-fit px-2 py-1 sm:px-4 sm:pt-2 text-white font-semibold`
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
