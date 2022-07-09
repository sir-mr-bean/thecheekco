import { PageFourOptions } from "@/types/PageOptions";
import PageFourOption from "@/components/CheekyBox/Pages/PageFour/PageFourOption";
import { useRef, useEffect } from "react";
import lottie from "lottie-web";
const PageFour = ({
  pageFourOptions,
  setPageFourOptions,
}: {
  pageFourOptions: PageFourOptions;
  setPageFourOptions: (pageFourOptions: PageFourOptions) => void;
}) => {
  const plantRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (plantRef.current) {
      lottie.loadAnimation({
        container: plantRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../../public/images/CheekyBox/hangingplant.json"),
      });
    }

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <>
      <div className="relative flex max-h-fit w-full flex-col items-center justify-start">
        <div
          className="-right-6 mx-auto hidden w-1/3 sm:absolute sm:block xl:-right-24"
          ref={plantRef ? plantRef : ""}
          onMouseEnter={() => lottie.play()}
          onMouseLeave={() => lottie.pause()}
        />
        <span className=" mb-6 text-center text-2xl sm:text-4xl">
          skin types
        </span>
        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base  lg:text-lg">
          <div className="flex w-full items-center justify-center ">
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>How would you identify your skin</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-2 grid h-full w-fit grid-cols-2 content-center items-center justify-center gap-3 p-2">
        <div className="col-span-2 mx-auto items-center justify-center">
          <PageFourOption
            pageFourOptions={pageFourOptions}
            setPageFourOptions={setPageFourOptions}
            option="combination"
          />
        </div>
        <PageFourOption
          pageFourOptions={pageFourOptions}
          setPageFourOptions={setPageFourOptions}
          option="dry"
        />
        <PageFourOption
          pageFourOptions={pageFourOptions}
          setPageFourOptions={setPageFourOptions}
          option="oily"
        />
      </div>
      <div className="flex h-fit w-full flex-col items-center justify-start">
        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base lg:text-lg">
          <div className="flex w-full items-center justify-center ">
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>levels of sensitivity</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-2 grid w-fit grid-cols-2 content-center items-center justify-center gap-3 p-2">
          <div className="col-span-2 mx-auto items-center justify-center">
            <PageFourOption
              pageFourOptions={pageFourOptions}
              setPageFourOptions={setPageFourOptions}
              option="mild"
            />
          </div>
          <PageFourOption
            pageFourOptions={pageFourOptions}
            setPageFourOptions={setPageFourOptions}
            option="medium"
          />
          <PageFourOption
            pageFourOptions={pageFourOptions}
            setPageFourOptions={setPageFourOptions}
            option="high"
          />
        </div>
      </div>
    </>
  );
};

export default PageFour;
