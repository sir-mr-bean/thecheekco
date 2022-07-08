import { PageThreeOptions } from "@/types/PageOptions";
import PageThreeOption from "@/components/CheekyBox/Pages/PageThree/PageThreeOption";
import { useRef, useEffect } from "react";
import lottie from "lottie-web";

const PageThree = ({
  pageThreeOptions,
  setPageThreeOptions,
}: {
  pageThreeOptions: PageThreeOptions;
  setPageThreeOptions: Function;
}) => {
  const catRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (catRef.current) {
      lottie.loadAnimation({
        container: catRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../../public/images/CheekyBox/cat.json"),
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
          scents & allergies
        </span>
        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base  lg:text-lg">
          <div className="flex w-full items-center justify-center ">
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>
                What types of scents do you prefer in your bath & body products:
                Select as many as you like.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 grid h-full w-fit grid-cols-2 content-center items-center justify-center gap-3 p-2">
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="floral"
        />
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="all natural"
        />
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="dark & sexy"
        />
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="fruity"
        />
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="sweet"
        />
        <PageThreeOption
          pageThreeOptions={pageThreeOptions}
          setPageThreeOptions={setPageThreeOptions}
          option="fragrance free"
        />
      </div>
      <div className="flex w-full items-center justify-center space-x-3 pt-16 sm:translate-x-12 sm:pt-8 ">
        <label className="text-center text-xs text-text-primary sm:text-base">
          do you have an allergies we should be aware of?
        </label>
        <input
          type="text"
          onChange={(e) =>
            setPageThreeOptions((pageThreeOptions: PageThreeOptions) => {
              return {
                ...pageThreeOptions,
                allergies: e.target.value,
              };
            })
          }
          className="rounded-md border-0 p-1  text-text-primary caret-text-primary focus:border-0 focus:border-none focus:border-transparent focus:border-text-primary focus:ring-0"
        />
        <div
          className="mx-auto hidden w-1/5 sm:block  xl:-right-9"
          ref={catRef ? catRef : ""}
          onMouseEnter={() => lottie.play()}
          onMouseLeave={() => lottie.pause()}
        />
      </div>
    </>
  );
};

export default PageThree;
