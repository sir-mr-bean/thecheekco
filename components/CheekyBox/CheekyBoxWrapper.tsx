import { Transition } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import CheekyBoxIntro from "./CheekyBoxIntro";
import PageOne from "./Pages/PageOne";
import PageTwo from "./Pages/PageTwo";
import PageFour from "./Pages/PageFour";
import PageFive from "./Pages/PageFive";
import PageSix from "./Pages/PageSix";
import PageThree from "./Pages/PageThree";
import FinalPage from "./Pages/FinalPage";
import Head from "next/head";

const CheekyBoxWrapper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [moving, setMoving] = useState("right");

  const [steps, setSteps] = useState([
    { name: "Step 1", href: "#", status: "current" },
    { name: "Step 2", href: "#", status: "upcoming" },
    { name: "Step 3", href: "#", status: "upcoming" },
    { name: "Step 4", href: "#", status: "upcoming" },
    { name: "Step 5", href: "#", status: "upcoming" },
    { name: "Step 6", href: "#", status: "upcoming" },
    { name: "Step 7", href: "#", status: "upcoming" },
    { name: "Step 8", href: "#", status: "upcoming" },
  ]);

  const [pageOneOptions, setPageOneOptions] = useState({
    bathProducts: false,
    showerProducts: false,
    both: false,
  });

  const prevStep = () => {
    setMoving("left");
    setSteps((old) =>
      old.map((v, i) => {
        if (i === currentStep) {
          v.status = "upcoming";
        } else if (i === currentStep - 1) {
          v.status = "current";
        }
        return v;
      })
    );
    setCurrentStep(currentStep - 1);
    return false;
  };

  const nextStep = async () => {
    setMoving("right");
    // getValues('firstname')

    if (true) {
      setSteps((old) =>
        old.map((v, i) => {
          if (i === currentStep) {
            v.status = "complete";
          } else if (i === currentStep + 1) {
            v.status = "current";
          }
          return v;
        })
      );
      setCurrentStep(currentStep + 1);
    }
    return false;
  };

  const wrapper = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(1);

  useEffect(() => {
    function handleResize() {
      if (wrapper.current !== null) {
        setWrapperWidth(wrapper.current.offsetWidth);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>The Cheek Co. - Cheeky Box</title>
        <meta
          name="description"
          content="Designed to expand your bathing experience and top up on
          bathroom necessities, from shampoo bars & liquid soap to accessories
          and skin care."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white mt-10 sm:mt-16 mx-1 md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary overflow-visible ">
        <div className="flex-1 flex flex-col justify-between items-center py-12 px-4 sm:px-6 h-[75vh]">
          <h1 className="text-3xl sm:text-5xl font-light">
            Build your Cheeky Box!
          </h1>
          <div
            className="flex items-start overflow-hidden w-80 sm:w-full"
            ref={wrapper}
          >
            <div className="flex flex-nowrap items-center">
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 0}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <CheekyBoxIntro />
                </div>
              </Transition>

              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 1}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageOne
                    pageOneOptions={pageOneOptions}
                    setPageOneOptions={setPageOneOptions}
                  />
                </div>
              </Transition>
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 2}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageTwo />
                </div>
              </Transition>

              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 3}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageThree />
                </div>
              </Transition>

              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 4}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="bg-blue-200 w-0 overflow-visible"
                as="div"
              >
                <div
                  className="mx-auto"
                  style={{ width: `${wrapperWidth / 1.3}px` }}
                >
                  <PageFour />
                </div>
              </Transition>
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 5}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="bg-blue-200 w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageFive />
                </div>
              </Transition>
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 6}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="bg-blue-200 w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageSix />
                </div>
              </Transition>
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 7}
                enter="transform transition ease-in-out duration-700"
                enterFrom={
                  moving === "right"
                    ? `translate-x-80 opacity-0`
                    : `-translate-x-80 opacity-0`
                }
                enterTo={`translate-x-0 opacity-100`}
                leave="transform transition ease-in-out duration-500 "
                leaveFrom={`translate-x-0 opacity-100`}
                leaveTo={
                  moving === "right"
                    ? `-translate-x-80 opacity-0`
                    : `translate-x-80 opacity-0`
                }
                className="bg-blue-200 w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <FinalPage />
                </div>
              </Transition>
            </div>
          </div>
          <div className={`mt-2`}>
            <p className="text-xs sm:text-sm font-medium mb-1 mt-3 text-center">
              Step {steps.findIndex((step) => step.status === "current") + 1} of{" "}
              {steps.length}
            </p>
            <nav
              className="flex items-center justify-center"
              aria-label="Progress"
            >
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => prevStep()}
                className="uppercase bg-button border border-transparent rounded-md py-2 px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5"
              >
                Prev
              </button>
              <ol className="mx-1 sm:mx-8 flex items-center space-x-2 sm:space-x-5">
                {steps.map((step, i) => (
                  <li key={`step_${i}`}>
                    {step.status === "complete" ? (
                      <a
                        href={step.href}
                        className="block w-2.5 h-2.5 bg-text-primary rounded-full hover:bg-text-secondary"
                      >
                        <span className="sr-only"></span>
                      </a>
                    ) : step.status === "current" ? (
                      <a
                        href={step.href}
                        className="relative flex items-center justify-center"
                        aria-current="step"
                      >
                        <span
                          className="absolute w-4 h-4 sm:w-6 sm:h-6 p-px flex"
                          aria-hidden="true"
                        >
                          <span className="w-full h-full rounded-full bg-text-secondary/30" />
                        </span>
                        <span
                          className="relative block sm:w-2.5 sm:h-2.5 w-2 h-2 bg-text-secondary rounded-full"
                          aria-hidden="true"
                        />
                        <span className="sr-only"></span>
                      </a>
                    ) : (
                      <a
                        href={step.href}
                        className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400"
                      >
                        <span className="sr-only"></span>
                      </a>
                    )}
                  </li>
                ))}
              </ol>
              <button
                type="button"
                disabled={currentStep === 7}
                onClick={() => nextStep()}
                className={
                  currentStep === 7
                    ? `uppercase bg-button border border-transparent rounded-md py-2 px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5 cursor-not-allowed`
                    : `uppercase bg-button border border-transparent rounded-md py-2 px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5`
                }
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheekyBoxWrapper;
