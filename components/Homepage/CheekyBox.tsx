import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import Link from "next/link";

const CheekyBox = () => {
  const strayCatRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (strayCatRef.current) {
      lottie.loadAnimation({
        container: strayCatRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: require("../../public/images/Homepage/Lottie/stray-cat.json"),
      });
    }

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <section className="flex w-full flex-1 flex-col items-center justify-end bg-paper-bg bg-cover font-gothic shadow-3xl shadow-slate-600">
      <div className="flex w-full items-center justify-center bg-white bg-opacity-20 shadow-text-primary">
        <div className="my-16 flex w-full flex-col items-center justify-end text-text-primary">
          <span className="text-2xl sm:text-4xl">introducing</span>
          <span className="text-4xl font-semibold sm:text-6xl">
            the cheeky box.
          </span>
          <div className="mt-4 flex w-full flex-col-reverse items-start justify-center space-x-10 sm:flex-row">
            <div
              className="mx-auto w-4/5 sm:w-1/4"
              ref={strayCatRef ? strayCatRef : ""}
              onMouseEnter={() => lottie.play()}
              onMouseLeave={() => lottie.pause()}
            />
            <div className="flex w-3/4 flex-col items-start justify-start text-xl sm:w-2/3">
              <span className="pt-10 sm:w-4/5">
                A limited run monthly mystery subscription box designed to keep
                you & your bathroom plastic free and fabulous without any
                stress. Each month will contain an assortment of bathroom
                goodies to keep your regulars needs satisfied with a generous
                splash of delicous seasonal goodness.
              </span>
              <span className="pt-12 pb-2">
                Each month will contain (but of course will not be limited to):
              </span>
              <ul className="pl-5 text-lg sm:text-xl">
                <li className="list-disc  text-text-secondary">
                  shampoo & conditioner bar{" "}
                </li>
                <li className="list-disc text-text-secondary">
                  limited edition soap bar
                </li>
                <li className="list-disc text-text-secondary">
                  skin care product
                </li>
                <li className="list-disc text-text-secondary">
                  bathroom / beauty accessory
                </li>
                <li className="list-disc text-text-secondary">
                  bath soak or shower steamer
                </li>
              </ul>
              <span></span>
              <div className="mx-auto flex items-center justify-center py-6 sm:mx-0">
                <Link passHref href="/cheekybox">
                  <a href="/cheekybox">
                    <button className="rounded-md border border-transparent bg-button py-1 px-4 shadow-sm shadow-text-secondary hover:border-white">
                      <span className="font-gothic text-sm font-semibold uppercase tracking-wide text-white">
                        Secure your cheeky box today
                      </span>
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheekyBox;
