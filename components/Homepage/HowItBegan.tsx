import Image from "next/image";
import maddiAvatar from "../../public/images/Homepage/maddiavatar.png";
import lottie from "lottie-web";
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { useEffect, useRef } from "react";

const HowItBegan = () => {
  const loaderCatRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    if (loaderCatRef.current) {
      lottie.loadAnimation({
        container: loaderCatRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("../../public/images/Homepage/Lottie/loader-cat.json"),
      });
    }
    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <section
      aria-labelledby="social-impact-heading"
      className="mt-16 w-full bg-paper-bg bg-cover sm:mt-24"
    >
      <div className="flex w-full items-start justify-center bg-white bg-opacity-20 pt-16 shadow-text-primary sm:px-12 sm:pt-20 xl:px-32">
        <div className="relative sm:h-96 sm:w-96">
          <Image
            src={maddiAvatar}
            height={144}
            width={144}
            layout="responsive"
            alt="Maddi"
          />
        </div>
        <div className="flex flex-col p-5 sm:p-0">
          <h2
            id="social-impact-heading"
            className="mx-1 max-w-xl text-center font-gothic font-extrabold tracking-tight text-text-secondary sm:text-left"
          >
            <span className="text-4xl font-semibold lg:text-6xl">
              How it all began...
            </span>
          </h2>
          <div className="flex flex-col items-start justify-start space-y-4 py-4 text-left font-gothic text-lg text-text-primary">
            <p>
              It began with an itch, an eczema itch! Suffering from eczema Maddi
              struggled to find natural, local products that weren't wrapped in
              plastic or over packaged.
            </p>
            <p>
              Maddi began The Cheek Co by developing bath and skin care products
              specifically for her family's needs. Ensuring they would be
              natural & nourishing from cheek to cheek.
            </p>
            <p>
              Keep up with Maddi behind the scenes as she whips up fresh goodies
              daily.
            </p>
            <div className="mt-2 flex w-full items-start justify-start">
              <a
                href="https://www.instagram.com/thecheekco/"
                target="_blank"
                className="relative mt-6 flex w-fit cursor-pointer items-center justify-center rounded-md border border-transparent bg-button py-2 px-8 font-gothic text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-text-secondary hover:border-white sm:text-sm"
              >
                FOLLOW MADDI’S SHENANIGANS
              </a>
              <div
                className="w-7/8 mx-auto sm:w-1/4 xl:-translate-y-16"
                ref={loaderCatRef ? loaderCatRef : ""}
                onMouseEnter={() => lottie.play()}
                onMouseLeave={() => lottie.pause()}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItBegan;
