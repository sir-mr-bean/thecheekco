import { trpc } from "@/utils/trpc";
import { useState } from "react";
import toast from "react-hot-toast";
import { Subscription } from "square";

const CancelButton = ({ subscription }: { subscription: Subscription }) => {
  const [cancelling, setCancelling] = useState(false);
  const cancelSubscription = trpc.useMutation([
    "square-subscription.cancel-subscription",
  ]);
  const utils = trpc.useContext();

  const handleCancelSubscription = (subscription: Subscription) => {
    setCancelling(true);
    cancelSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
        reason: "CUSTOMER_CANCELLED",
      },
      {
        onSuccess: () => {
          toast.success("Subscription cancelled");
          utils.invalidateQueries(["square-subscription.get-my-subscriptions"]);
          setCancelling(false);
        },
      }
    );
  };
  return (
    <button
      disabled={cancelling}
      className="rounded-lg border border-text-secondary px-2 py-2 text-xs font-semibold leading-5 text-text-primary hover:border-white hover:bg-button hover:text-white"
      onClick={() => handleCancelSubscription(subscription)}
    >
      <span>{cancelling ? "Cancelling..." : "Cancel"}</span>
    </button>
  );
};

export default CancelButton;
