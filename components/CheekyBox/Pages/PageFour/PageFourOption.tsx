import { PageFourOptions } from "@/types/PageOptions";

const PageFourOption = ({
  pageFourOptions,
  setPageFourOptions,
  option,
}: {
  pageFourOptions: PageFourOptions;
  setPageFourOptions: Function;
  option: string;
}) => {
  const optionCapitalised = option
    .split(" ")
    .map((word, index) => {
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
        setPageFourOptions((prevOptions: PageFourOptions) => ({
          ...prevOptions,
          [optionCapitalised]:
            !pageFourOptions[`${optionCapitalised}` as keyof PageFourOptions],
        }));
      }}
      className="flex w-32 cursor-pointer items-center justify-center whitespace-nowrap text-center text-xs sm:w-72 sm:text-lg"
    >
      <span
        className={
          pageFourOptions[`${optionCapitalised}` as keyof PageFourOptions] ===
          true
            ? `w-32 rounded-lg border border-text-secondary bg-button py-2 px-3 font-semibold text-text-primary sm:w-48 lg:w-72 lg:px-20 `
            : `w-32 rounded-lg border border-transparent border-text-secondary bg-bg-tan px-3 py-2 font-semibold text-text-primary hover:border-text-primary sm:w-48 lg:w-72 lg:px-20`
        }
      >
        {option}
      </span>
    </div>
  );
};

export default PageFourOption;
