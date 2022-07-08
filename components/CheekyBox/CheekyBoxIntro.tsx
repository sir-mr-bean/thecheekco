import SubscriptionOption from "./Pages/CheekyBoxForm/Intro/SubscriptionOption";

const CheekyBoxIntro = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center font-gothic text-sm sm:text-xl">
      <div className="flex w-full flex-col items-center space-y-10 px-5 lg:px-20">
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
        <div className="flex w-full flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-24 xl:w-3/4">
          <SubscriptionOption duration="monthly" price="49.99" />
          <SubscriptionOption duration="threemonths" price="149.97" />
        </div>
      </div>
      <div className="my-6 flex w-full items-center justify-end">
        <span className="text-text-primary">
          Tell us a bit about your preferences →
        </span>
      </div>
    </div>
  );
};

export default CheekyBoxIntro;
