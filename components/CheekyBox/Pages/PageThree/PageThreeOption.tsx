import { PageThreeOptions } from "@/types/PageOptions";

const PageThreeOption = ({
  pageThreeOptions,
  setPageThreeOptions,
  option,
}: {
  pageThreeOptions: PageThreeOptions;
  setPageThreeOptions: Function;
  option: string;
}) => {
  const optionCapitalised = option
    .replace("&", "And")
    .split(" ")
    .map((word: string, index: number) => {
      if (index === 0) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join("");

  return (
    <div
      onClick={() => {
        setPageThreeOptions((prevOptions: PageThreeOptions) => ({
          ...prevOptions,
          [optionCapitalised]:
            !pageThreeOptions[`${optionCapitalised}` as keyof PageThreeOptions],
        }));
      }}
      className="flex w-36 cursor-pointer items-center justify-center whitespace-nowrap text-center text-xs sm:w-72 sm:text-lg"
    >
      <span
        className={
          pageThreeOptions[`${optionCapitalised}` as keyof PageThreeOptions] ===
          true
            ? `w-36 rounded-lg border border-text-secondary bg-button py-2 px-3 font-semibold text-text-primary sm:w-48 lg:w-72 lg:px-20 `
            : `w-36 rounded-lg border border-transparent border-text-secondary bg-bg-tan px-3 py-2 font-semibold text-text-primary hover:border-text-primary sm:w-48 lg:w-72 lg:px-20   `
        }
      >
        {option}
      </span>
    </div>
  );
};

export default PageThreeOption;
