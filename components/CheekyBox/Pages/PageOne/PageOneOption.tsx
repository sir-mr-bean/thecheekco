import { PageOneOptions } from "@/types/PageOptions";

const PageOneOption = ({
  pageOneOptions,
  setPageOneOptions,
  option,
}: {
  pageOneOptions: PageOneOptions;
  setPageOneOptions: Function;
  option: string;
}) => {
  return (
    <div
      onClick={() => {
        setPageOneOptions({
          bathProducts: false,
          showerProducts: false,
          both: false,
        });
        setPageOneOptions((prevOptions: PageOneOptions) => ({
          ...prevOptions,
          [option]: true,
        }));
      }}
      className="cursor-pointer"
    >
      <span
        className={
          pageOneOptions[`${option}` as keyof PageOneOptions] === true
            ? `w-fit rounded-lg border border-text-secondary bg-button px-4 py-2 font-semibold text-text-primary sm:px-16 `
            : `w-fit rounded-lg border border-transparent border-text-secondary bg-bg-tan px-4 py-2 font-semibold text-text-primary hover:border-text-primary sm:px-16 `
        }
      >
        {option}
      </span>
    </div>
  );
};

export default PageOneOption;
