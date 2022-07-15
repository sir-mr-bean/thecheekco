import { Transition } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import CheekyBoxIntro from "./CheekyBoxIntro";
import PageOne from "./Pages/PageOne/PageOne";
import PageTwo from "./Pages/PageTwo/PageTwo";
import PageFour from "./Pages/PageFour/PageFour";
import PageFive from "./Pages/PageFive/PageFive";
import PageSix, {
  cheekyBoxUserGifter,
  cheekyBoxUserRecipient,
} from "./Pages/PageSix";
import PageThree from "./Pages/PageThree/PageThree";
import FinalPage from "./Pages/FinalPage";
import Head from "next/head";
import * as z from "zod";
import { useZodForm } from "@/utils/hooks/useZodForm";
import { IntroOptions } from "@/types/PageOptions";
import { prisma } from "@/backend/utils/prisma";

const CheekyBoxWrapper = () => {
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
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
    { name: "Step 9", href: "#", status: "upcoming" },
  ]);

  const [introOptions, setIntroOptions] = useState<IntroOptions>({
    duration: "",
  });

  const [pageOneOptions, setPageOneOptions] = useState({
    bath: false,
    shower: false,
    both: false,
  });

  const [pageTwoOptions, setPageTwoOptions] = useState({
    shampooBar: false,
    conditioner: false,
    bodyWash: false,
    bodyButter: false,
    soapBar: false,
    bathSoak: false,
    beautyTools: false,
    hygieneAccessories: false,
  });

  const [pageThreeOptions, setPageThreeOptions] = useState({
    floral: false,
    allNatural: false,
    darkAndSexy: false,
    fruity: false,
    sweet: false,
    fragranceFree: false,
    allergies: "",
  });

  const [pageFourOptions, setPageFourOptions] = useState({
    dry: false,
    oily: false,
    combination: false,
    mild: false,
    medium: false,
    high: false,
  });

  const [pageFiveOptions, setPageFiveOptions] = useState({
    hair: false,
    skin: false,
    sleep: false,
    bathroomAccessories: false,
    homeDecor: false,
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <div className=" mx-3 mt-10 overflow-visible font-gothic  text-text-primary sm:mt-16 md:mx-16 ">
        <div className="flex flex-1 flex-col items-center justify-start px-4 sm:py-3 sm:px-6 ">
          <h1 className="text-center text-4xl font-light sm:text-7xl">
            the cheeky box
          </h1>
          <div
            className="flex min-h-[60vh] w-full flex-1 grow items-start"
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
                  <CheekyBoxIntro
                    introOptions={introOptions}
                    setIntroOptions={setIntroOptions}
                    nextStep={nextStep}
                  />
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
                <div style={{ width: `${wrapperWidth}px` }}>
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
                <div style={{ width: `${wrapperWidth}px` }}>
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
                className="w-0 overflow-visible bg-blue-200"
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
                className="w-0 overflow-visible bg-blue-200"
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
                className="w-0 overflow-visible bg-blue-200"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <FinalPage
                    introOptions={introOptions}
                    pageOneOptions={pageOneOptions}
                    pageTwoOptions={pageTwoOptions}
                    pageThreeOptions={pageThreeOptions}
                    pageFourOptions={pageFourOptions}
                    pageFiveOptions={pageFiveOptions}
                    gift={gift}
                    giftForm={giftForm}
                    gifterForm={gifterForm}
                    setPaymentSuccessful={setPaymentSuccessful}
                    setCurrentStep={setCurrentStep}
                  />
                </div>
              </Transition>
              <Transition
                appear={false}
                unmount={false}
                show={currentStep === 8}
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
                className="w-0 overflow-visible bg-blue-200"
                as="div"
              >
                <div style={{ width: `${wrapperWidth}px`, height: "100%" }}>
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <span className="pt-10 text-center text-2xl sm:text-4xl">
                      Thanks for your order!
                    </span>
                    <span className="pt-10 text-center text-lg sm:text-4xl">
                      You will recieve an email with your subscription details,
                      and you can manage your subscription at any time by
                      logging in to your account.
                    </span>
                    <div className="pt-10">
                      <a
                        className="underline decoration-text-secondary decoration-dotted underline-offset-2"
                        href="/"
                      >
                        Return Home
                      </a>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className={`mt-2`}>
              <p className="mb-1 mt-3 text-center text-xs font-medium sm:text-sm">
                Step {steps.findIndex((step) => step.status === "current") + 1}{" "}
                of {steps.length - 1}
              </p>
              <nav
                className="flex items-center justify-center"
                aria-label="Progress"
              >
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => prevStep()}
                  className="flex items-center justify-center rounded-md border border-transparent bg-button py-2 px-4 pt-2.5 text-base font-medium uppercase text-white hover:border hover:border-black sm:px-8"
                >
                  Prev
                </button>
                <ol className="mx-2 flex items-center space-x-2 sm:mx-8 sm:space-x-5">
                  {steps
                    .filter((step, i) => i < steps.length - 1)
                    .map((step, i) => (
                      <li key={`step_${i}`}>
                        {step.status === "complete" ? (
                          <div
                            onClick={() => thisStep(i)}
                            className="block h-2.5 w-2.5 cursor-pointer rounded-full bg-text-primary hover:bg-text-secondary"
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
                              className="absolute flex h-4 w-4 p-px sm:h-6 sm:w-6"
                              aria-hidden="true"
                            >
                              <span className="h-full w-full rounded-full bg-text-secondary/30" />
                            </span>
                            <span
                              className="relative block h-2 w-2 rounded-full bg-text-secondary sm:h-2.5 sm:w-2.5"
                              aria-hidden="true"
                            />
                            <span className="sr-only"></span>
                          </a>
                        ) : (
                          <div
                            onClick={() => thisStep(i)}
                            className="block h-2.5 w-2.5 cursor-pointer rounded-full bg-text-secondary"
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
                      if (gift)
                        await gifterForm.trigger(undefined, {
                          shouldFocus: true,
                        });
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
                    className={`flex items-center justify-center rounded-md border border-transparent bg-button py-2 px-4 pt-2.5 text-base font-medium uppercase text-white hover:border hover:border-black`}
                  >
                    Next
                  </button>
                ) : currentStep === 7 ? (
                  <></>
                ) : (
                  <button
                    type="button"
                    disabled={currentStep === 7}
                    onClick={() => nextStep()}
                    className={
                      currentStep === 7
                        ? `flex cursor-not-allowed items-center justify-center rounded-md border border-transparent bg-button py-2 px-4 pt-2.5 text-base font-medium uppercase text-white hover:border hover:border-black`
                        : `flex items-center justify-center rounded-md border border-transparent bg-button py-2 px-4 pt-2.5 text-base font-medium uppercase text-white hover:border hover:border-black`
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
