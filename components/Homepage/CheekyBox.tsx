import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const CheekyBox = () => {
  const strayCatRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (strayCatRef.current) {
      lottie.loadAnimation({
        container: strayCatRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: require("../../public/images/stray-cat.json"),
      });
    }

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <section className="bg-paper-bg bg-cover flex flex-col justify-center items-center w-full flex-1 shadow-3xl shadow-slate-600 my-10 font-gothic">
      <div className="flex flex-col items-center justify-center text-text-primary">
        <span className="text-2xl sm:text-4xl mt-4 ">introducing</span>
        <span className="text-4xl sm:text-6xl font-semibold mt-4">
          the cheeky box.
        </span>
        <div className="flex flex-col-reverse sm:flex-row w-full items-start justify-center mt-4 space-x-10">
          <div
            className="w-4/5 sm:w-1/3 mx-auto"
            ref={strayCatRef ? strayCatRef : ""}
            onMouseEnter={() => lottie.play()}
            onMouseLeave={() => lottie.pause()}
          />
          <div className="flex flex-col items-start justify-center sm:w-2/3 text-xl w-3/4">
            <span className="sm:w-4/5 pt-10">
              A limited run monthly mystery subscription box designed to keep
              you & your bathroom plastic free and fabulous without any stress.
              Each month will contain an assortment of bathroom goodies to keep
              your regulars needs satisfied with a generous splash of delicous
              seasonal goodness.
            </span>
            <span className="pt-12 pb-2">
              each month will contain (but of course will not be limited to):
            </span>
            <ul className="pl-5 text-lg sm:text-xl">
              <li className="text-text-secondary  list-disc">
                shampoo & conditioner bar{" "}
              </li>
              <li className="text-text-secondary list-disc">
                limited edition soap bar
              </li>
              <li className="text-text-secondary list-disc">
                skin care product
              </li>
              <li className="text-text-secondary list-disc">
                bathroom / beauty accessory
              </li>
              <li className="text-text-secondary list-disc">
                bath soak or shower steamer
              </li>
            </ul>
            <span></span>
            <div className="py-6 flex items-center justify-center mx-auto sm:mx-0">
              <button className="bg-button shadow-sm shadow-text-secondary py-1 px-4 rounded-md border border-transparent hover:border-black ">
                <span className="uppercase text-white text-sm">
                  Secure your cheeky box today
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheekyBox;
