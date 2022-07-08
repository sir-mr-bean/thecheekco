import { PageTwoOptions } from "@/types/PageOptions";
import PageTwoOption from "@/components/CheekyBox/Pages/PageTwo/PageTwoOption";
import { useRef, useEffect } from "react";
import lottie from "lottie-web";
const PageTwo = ({
  pageTwoOptions,
  setPageTwoOptions,
}: {
  pageTwoOptions: PageTwoOptions;
  setPageTwoOptions: (pageTwoOptions: PageTwoOptions) => void;
}) => {
  const plantRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (plantRef.current) {
      lottie.loadAnimation({
        container: plantRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../../../public/images/CheekyBox/flower.json"),
      });
    }

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-center justify-start">
        <div
          className="-right-6 mx-auto hidden w-1/5 sm:absolute sm:block xl:-right-9"
          ref={plantRef ? plantRef : ""}
          onMouseEnter={() => lottie.play()}
          onMouseLeave={() => lottie.pause()}
        />
        <span className=" mb-6 text-center text-2xl sm:text-4xl">
          likes & dislikes
        </span>
        <div className="flex w-full flex-col items-center justify-between space-y-4 text-center text-sm text-text-primary sm:w-3/4 sm:text-base  lg:text-lg">
          <div className="flex w-full items-center justify-center ">
            <div className="-m-12 my-8 flex w-full flex-col items-center justify-between space-y-4">
              <span>
                Tell us a bit about the items would you like to see regularly
                occuring in the box, select as many as you like.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 grid h-full w-fit grid-cols-2 content-center items-center justify-center gap-3 p-2">
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="shampoo bar"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="conditioner"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="body wash"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="body butter"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="soap bar"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="bath soak"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="beauty tools"
        />
        <PageTwoOption
          pageTwoOptions={pageTwoOptions}
          setPageTwoOptions={setPageTwoOptions}
          option="hygiene accessories"
        />
      </div>
    </>
  );
};

export default PageTwo;
