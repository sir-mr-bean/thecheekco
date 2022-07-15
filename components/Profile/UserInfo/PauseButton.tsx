import { useState } from "react";
import { Subscription } from "square";

const PauseButton = ({
  handlePauseSubscription,
  subscription,
  duration,
}: {
  handlePauseSubscription: Function;
  subscription: Subscription;
  duration: number;
}) => {
  const [pausing, setPausing] = useState(false);
  return (
    <button
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
