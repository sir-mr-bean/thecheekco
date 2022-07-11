import { PageFiveOptions } from "@/types/PageOptions";
import PageFiveOption from "@/components/CheekyBox/Pages/PageFive/PageFiveOption";
import { useRef, useEffect } from "react";
import lottie from "lottie-web";

const PageFive = ({
  pageFiveOptions,
  setPageFiveOptions,
}: {
  pageFiveOptions: PageFiveOptions;
  setPageFiveOptions: Function;
}) => {
  const catRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (catRef.current) {
      lottie.loadAnimation({
        container: catRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../../public/images/Homepage/Lottie/stray-cat.json"),
      });
    }

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-center justify-start">
        <span className=" mb-6 text-center text-2xl sm:text-4xl">
          home & accessories
        </span>
        <div
          className="top-64 left-5 hidden sm:block sm:w-1/4 xl:absolute"
          ref={catRef ? catRef : ""}
          onMouseEnter={() => lottie.play()}
          onMouseLeave={() => lottie.pause()}
        />

        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base  lg:text-lg">
          <div className="flex w-full items-center justify-center ">
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>
                Lastly what types of additonal items would excite you the most
                to recieve?
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:mt-18 mx-auto mt-36 grid h-full w-fit grid-cols-2 content-center items-center justify-center gap-3 p-2 sm:mt-10">
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="hair"
        />
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="bathroom accessories"
        />
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="skin"
        />
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="home decor"
        />
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="sleep"
        />
        <PageFiveOption
          pageFiveOptions={pageFiveOptions}
          setPageFiveOptions={setPageFiveOptions}
          option="wearable"
        />
      </div>
    </>
  );
};

export default PageFive;
