import SubscriptionOption from "./Pages/CheekyBoxForm/Intro/SubscriptionOption";

const CheekyBoxIntro = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div className="flex flex-col items-center text-sm sm:text-xl justify-center font-gothic w-full">
      <div className="flex flex-col items-center w-full px-5 lg:px-20 space-y-10">
        <span className="text-2xl sm:text-4xl mt-3 text-center">
          monthly subscription
        </span>
        <div className="my-3 flex flex-col w-fit items-center justify-center text-center">
          <span className="text-base">
            The Cheeky Box is a decadent collection of limited edition & store
            favs.
          </span>
          <span className="text-base my-1">
            Designed to expand your bathing experience and top up on bathroom
            necessities.
          </span>
        </div>
        <div className="flex flex-col w-full sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-24 xl:w-3/4">
          <SubscriptionOption price="$10" />
          <SubscriptionOption price="$20" />
        </div>
      </div>
      <div className="w-full flex items-center justify-end my-6">
        <span className="text-text-primary">
          Tell us a bit about your preferences →
        </span>
      </div>
    </div>
  );
};

export default CheekyBoxIntro;
