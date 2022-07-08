import { IntroOptions } from "@/types/PageOptions";
import { useRef } from "react";
import SubscriptionOption from "./Pages/CheekyBoxForm/Intro/SubscriptionOption";
import SubscriptionOptions from "./Pages/CheekyBoxForm/Intro/SubscriptionOptions";

const CheekyBoxIntro = ({
  nextStep,
  introOptions,
  setIntroOptions,
}: {
  nextStep: () => void;
  introOptions: IntroOptions;
  setIntroOptions: (options: IntroOptions) => void;
}) => {
  const nextStepRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex w-full flex-col items-center justify-center font-gothic text-sm sm:text-xl">
      <div className="flex w-full flex-col items-center space-y-10 px-1 lg:px-20">
        <span className="mt-3 text-center text-2xl sm:text-4xl">
          monthly subscription
        </span>
        <div className="my-1 flex w-fit flex-col items-center justify-center text-center sm:my-3">
          <span className="text-base">
            The Cheeky Box is a decadent collection of limited edition & store
            favs.
          </span>
          <span className="my-1 text-base">
            Designed to expand your bathing experience and top up on bathroom
            necessities.
          </span>
        </div>
        <SubscriptionOptions
          introOptions={introOptions}
          setIntroOptions={setIntroOptions}
          nextStepRef={nextStepRef}
        />
      </div>
      <div className="my-6 flex w-full items-center justify-end">
        <button
          className="mx-1 px-4 py-2 focus:animate-pulse focus:rounded-xl focus:ring-2 focus:ring-text-secondary focus:duration-1000 "
          ref={nextStepRef}
          onClick={nextStep}
        >
          <span className="text-text-primary">
            Tell us a bit about your preferences →
          </span>
        </button>
      </div>
    </div>
  );
};

export default CheekyBoxIntro;
