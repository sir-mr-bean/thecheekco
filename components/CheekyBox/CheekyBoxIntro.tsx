import { IntroOptions } from "@/types/PageOptions";
import { trpc } from "@/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
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
  const [soldOut, setSoldOut] = useState(false);
  const { data: existingSubscriptions, status: loadingExistingSubscriptions } =
    trpc.useQuery(["square-subscription.get-all-existing-subscriptions"]);
  useEffect(() => {
    if (existingSubscriptions) {
      const cheekyBoxes = existingSubscriptions.filter(
        (subscription) =>
          subscription.planId === "RWUIUC37IWXYHNMZROFRFANR" || // CheekyBox Monthly
          subscription.planId === "3LJVW5GICZQO674H6VHFE24O" // CheekyBox ThreeMonths
      );
      console.log(cheekyBoxes.length);
      if (cheekyBoxes.length - 3 >= 10) {
        setSoldOut(true);
      }
    }
  }, [existingSubscriptions]);

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
        {loadingExistingSubscriptions === "success" ? (
          <SubscriptionOptions
            introOptions={introOptions}
            setIntroOptions={setIntroOptions}
            nextStepRef={nextStepRef}
            soldOut={soldOut}
          />
        ) : (
          <>
            <div className="mx-auto flex h-full w-full items-center justify-center  text-text-primary">
              <BeatLoader
                color="#602d0d"
                loading={loadingExistingSubscriptions === String("loading")}
                size={8}
              />
            </div>
          </>
        )}
      </div>
      <div className="my-6 flex h-8 w-full items-center justify-end">
        {introOptions.duration && soldOut === false && (
          <button
            className="mx-1 px-4 py-2 focus:animate-pulse focus:rounded-xl focus:ring-2 focus:ring-text-secondary focus:duration-1000 "
            ref={nextStepRef}
            onClick={nextStep}
          >
            <span className="text-text-primary">
              Tell us a bit about your preferences →
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CheekyBoxIntro;
