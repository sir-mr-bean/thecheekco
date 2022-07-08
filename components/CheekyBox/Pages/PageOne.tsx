import type { PageOneOptions } from "@/types/PageOptions";
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import PageOneOption from "@/components/CheekyBox/Pages/PageOne/PageOneOption";

const PageOne = ({
  pageOneOptions,
  setPageOneOptions,
}: {
  pageOneOptions: PageOneOptions;
  setPageOneOptions: (pageOneOptions: PageOneOptions) => void;
}) => {
  const topHousePlantRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const bottomHousePlantRef =
    useRef() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    if (topHousePlantRef.current) {
      lottie.loadAnimation({
        container: topHousePlantRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/images/CheekyBox/houseplant.json"),
      });
    }
    if (bottomHousePlantRef.current) {
      lottie.loadAnimation({
        container: bottomHousePlantRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../public/images/CheekyBox/houseplant.json"),
      });
    }
    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-start">
        <span className=" mb-6 text-center text-2xl sm:text-4xl">
          likes & dislikes
        </span>
        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base  lg:text-lg">
          <div className="flex w-full items-center justify-center sm:-translate-x-24 xl:-translate-x-48">
            <div
              className="mx-auto hidden sm:block sm:w-fit sm:-translate-x-10 xl:w-fit xl:translate-y-24 xl:translate-x-16"
              ref={topHousePlantRef ? topHousePlantRef : ""}
              onMouseEnter={() => lottie.play()}
              onMouseLeave={() => lottie.pause()}
            />
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>
                To begin, tell us a little about your bathing & skin preferences
                to help shape each months selections. While this will help us to
                create the boxes we cannot guarantee your specific selections
                will be met each month, outside of the below.
              </span>

              <span>
                Please select the type of box you would like to recieve.
              </span>

              <span>
                All boxes will contain a mixture of skin care, soap, accessories
                & your selection below.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full items-start justify-center space-x-4 py-2 pt-8 sm:space-x-8 sm:px-5 lg:space-x-16 xl:pt-0">
        <PageOneOption
          pageOneOptions={pageOneOptions}
          setPageOneOptions={setPageOneOptions}
          option="bath"
        />
        <PageOneOption
          pageOneOptions={pageOneOptions}
          setPageOneOptions={setPageOneOptions}
          option="shower"
        />
        <PageOneOption
          pageOneOptions={pageOneOptions}
          setPageOneOptions={setPageOneOptions}
          option="both"
        />
      </div>
      <div
        className="mx-auto w-2/3 sm:hidden"
        ref={bottomHousePlantRef ? bottomHousePlantRef : ""}
        onMouseEnter={() => lottie.play()}
        onMouseLeave={() => lottie.pause()}
      />
    </>
  );
};

export default PageOne;
