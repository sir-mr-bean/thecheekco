import { Transition } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import CheekyBoxIntro from "./CheekyBoxIntro";
import PageOne from "./Pages/PageOne";
import PageTwo from "./Pages/PageTwo";
import PageFour from "./Pages/PageFour";
import PageFive from "./Pages/PageFive";
import PageSix, {
  cheekyBoxUserGifter,
  cheekyBoxUserRecipient,
} from "./Pages/PageSix";
import PageThree from "./Pages/PageThree";
import FinalPage from "./Pages/FinalPage";
import Head from "next/head";
import * as z from "zod";
import { useZodForm } from "@/utils/hooks/useZodForm";

const CheekyBoxWrapper = () => {
  const [cbUserObject, setCbUserObject] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postCode: "",
    country: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [moving, setMoving] = useState("right");
  const [gift, setGift] = useState(false);
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

  const [pageTwoOptions, setPageTwoOptions] = useState({
    shampooBar: false,
    conditioner: false,
    bodyWash: false,
    bodyButter: false,
    soapBar: false,
    bathSoak: false,
    bubbleBath: false,
    showerSteamer: false,
  });

  const [pageThreeOptions, setPageThreeOptions] = useState({
    sweet: false,
    fruity: false,
    masculine: false,
    floral: false,
    fragranceFree: false,
    avoid: "",
    allergies: "",
  });

  const [pageFourOptions, setPageFourOptions] = useState({
    dry: false,
    oily: false,
    normal: false,
    mix: false,
  });

  const [pageFiveOptions, setPageFiveOptions] = useState({
    hair: false,
    skin: false,
    sleep: false,
    home: false,
    wearable: false,
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

  const thisStep = (stepNumber: number) => {
    if (stepNumber > currentStep) {
      return false;
    }
    setSteps((old) =>
      old.map((v, i) => {
        if (i === stepNumber) {
          v.status = "current";
        } else if (i > stepNumber) {
          v.status = "upcoming";
        } else {
          v.status = "complete";
        }
        return v;
      })
    );
    setCurrentStep(stepNumber);
    return false;
  };

  const giftForm = useZodForm({
    schema: cheekyBoxUserRecipient,
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      postCode: "",
      country: "Australia",
    },
  });

  const gifterForm = useZodForm({
    schema: cheekyBoxUserGifter,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { handleSubmit } = giftForm;

  const nextStep = async () => {
    setMoving("right");
    // getValues('firstname')
    // if (currentStep === 6) {
    //   giftForm.trigger();
    //   giftForm.handleSubmit(async (values) => {
    //     console.log("data is ");
    //     console.log(values);
    //   });
    //}

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
      <div className=" mt-10 sm:mt-16 mx-3 md:mx-16  font-gothic text-text-primary overflow-visible ">
        <div className="flex-1 flex flex-col justify-start items-center sm:py-3 px-4 sm:px-6 ">
          <h1 className="text-4xl sm:text-7xl font-light text-center">
            the cheeky box
          </h1>
          <div
            className="flex items-start overflow-hidden w-80 sm:w-full min-h-[60vh]"
            ref={wrapper}
          >
            <div className="flex flex-nowrap items-center ">
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
                  <CheekyBoxIntro nextStep={nextStep} />
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
                  <PageTwo
                    pageTwoOptions={pageTwoOptions}
                    setPageTwoOptions={setPageTwoOptions}
                  />
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
                  <PageThree
                    pageThreeOptions={pageThreeOptions}
                    setPageThreeOptions={setPageThreeOptions}
                  />
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
                className="w-0 overflow-visible"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <PageFour
                    pageFourOptions={pageFourOptions}
                    setPageFourOptions={setPageFourOptions}
                  />
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
                  <PageFive
                    pageFiveOptions={pageFiveOptions}
                    setPageFiveOptions={setPageFiveOptions}
                  />
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
                  <PageSix
                    gift={gift}
                    setGift={setGift}
                    giftForm={giftForm}
                    gifterForm={gifterForm}
                    nextStep={nextStep}
                  />
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
                  <FinalPage
                    pageOneOptions={pageOneOptions}
                    pageTwoOptions={pageTwoOptions}
                    pageThreeOptions={pageThreeOptions}
                    pageFourOptions={pageFourOptions}
                    pageFiveOptions={pageFiveOptions}
                    gift={gift}
                  />
                </div>
              </Transition>
            </div>
          </div>
          {currentStep > 1 && (
            <div className={`mt-2`}>
              <p className="text-xs sm:text-sm font-medium mb-1 mt-3 text-center">
                Step {steps.findIndex((step) => step.status === "current") + 1}{" "}
                of {steps.length}
              </p>
              <nav
                className="flex items-center justify-center"
                aria-label="Progress"
              >
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => prevStep()}
                  className="uppercase bg-button border border-transparent rounded-md py-2 px-4 sm:px-8 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5"
                >
                  Prev
                </button>
                <ol className="mx-2 sm:mx-8 flex items-center space-x-2 sm:space-x-5">
                  {steps.map((step, i) => (
                    <li key={`step_${i}`}>
                      {step.status === "complete" ? (
                        <div
                          onClick={() => thisStep(i)}
                          className="block w-2.5 h-2.5 bg-text-primary rounded-full hover:bg-text-secondary cursor-pointer"
                        >
                          <span className="sr-only"></span>
                        </div>
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
                        <div
                          onClick={() => thisStep(i)}
                          className="block w-2.5 h-2.5 bg-text-secondary rounded-full cursor-pointer"
                        >
                          <span className="sr-only"></span>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
                {currentStep === 6 ? (
                  <button
                    type="submit"
                    onClick={async () => {
                      console.log("done!");
                      if (gift) await gifterForm.trigger();
                      await giftForm.trigger();
                      if (gift) {
                        if (
                          giftForm.formState.isValid &&
                          gifterForm.formState.isValid
                        ) {
                          nextStep();
                        }
                      } else {
                        if (giftForm.formState.isValid) {
                          nextStep();
                        }
                      }
                    }}
                    className={`uppercase bg-button border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={currentStep === 7}
                    onClick={() => nextStep()}
                    className={
                      currentStep === 7
                        ? `uppercase bg-button border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5 cursor-not-allowed`
                        : `uppercase bg-button border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:border hover:border-black pt-2.5`
                    }
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheekyBoxWrapper;
