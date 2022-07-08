import { IntroOptions } from "@/types/PageOptions";
import SubscriptionOption from "./SubscriptionOption";

const SubscriptionOptions = ({
  introOptions,
  setIntroOptions,
  nextStepRef,
}: {
  introOptions: IntroOptions;
  setIntroOptions: (options: IntroOptions) => void;
  nextStepRef: React.RefObject<HTMLButtonElement>;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-24 xl:w-3/4">
      <SubscriptionOption
        introOptions={introOptions}
        setIntroOptions={setIntroOptions}
        duration="monthly"
        price="49.99"
        nextStepRef={nextStepRef}
      />
      <SubscriptionOption
        introOptions={introOptions}
        setIntroOptions={setIntroOptions}
        duration="threemonths"
        price="149.97"
        nextStepRef={nextStepRef}
      />
    </div>
  );
};

export default SubscriptionOptions;
