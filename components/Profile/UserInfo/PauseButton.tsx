import { trpc } from "@/utils/trpc";
import { useState } from "react";
import toast from "react-hot-toast";
import { Subscription } from "square";

const PauseButton = ({
  subscription,
  duration,
}: {
  subscription: Subscription;
  duration: number;
}) => {
  const [pausing, setPausing] = useState(false);
  const pauseSubscription = trpc.useMutation([
    "square-subscription.pause-subscription",
  ]);
  const utils = trpc.useContext();
  const handlePauseSubscription = (
    subscription: Subscription,
    duration: number
  ) => {
    setPausing(true);
    pauseSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
        duration: duration,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries(["square-subscription.get-my-subscriptions"]);
          toast.success("Subscription paused");
          setPausing(false);
        },
      }
    );
  };
  return (
    <button
      disabled={pausing}
      className="rounded-lg border border-text-secondary px-2 py-2 text-xs font-semibold leading-5 text-text-primary hover:border-white hover:bg-button hover:text-white"
      onClick={() => handlePauseSubscription(subscription, duration)}
    >
      <span>
        {pausing
          ? "Pausing..."
          : duration === 1
          ? "Pause for 1 month"
          : duration === 2 && "Pause for 2 months"}
      </span>
    </button>
  );
};

export default PauseButton;
