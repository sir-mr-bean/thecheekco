import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { CatalogObject, Subscription } from "square";

const MySubscriptions = ({
  mySubscriptions,
  allPlans,
}: {
  mySubscriptions: Subscription[] | undefined;
  allPlans: CatalogObject[] | undefined;
}) => {
  const pauseSubscription = trpc.useMutation([
    "square-subscription.pause-subscription",
  ]);
  const resumeSubscription = trpc.useMutation([
    "square-subscription.resume-subscription",
  ]);
  const cancelSubscription = trpc.useMutation([
    "square-subscription.cancel-subscription",
  ]);
  const handlePauseSubscription = (subscription: Subscription) => {
    pauseSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
      },
      {
        onSuccess: () => {
          toast.success("Subscription paused");
        },
      }
    );
  };

  const handleResumeSubscription = (subscription: Subscription) => {
    resumeSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
      },
      {
        onSuccess: () => {
          toast.success("Subscription resumed");
        },
      }
    );
  };

  const handleCancelSubscription = (subscription: Subscription) => {
    cancelSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
        reason: "CUSTOMER_CANCELLED",
      },
      {
        onSuccess: () => {
          toast.success("Subscription cancelled");
        },
      }
    );
  };

  return (
    <div className="m-2 rounded-md bg-white px-4 py-5 font-gothic text-text-primary shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-text-primary">
            Cheeky Box Subscriptions
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Pause or cancel your Cheeky Box subscription anytime.
          </p>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          {mySubscriptions && mySubscriptions.length > 0 ? (
            <>
              {mySubscriptions.map((subscription) => {
                const thisPlan = allPlans?.find(
                  (plan) => plan.id === subscription.planId
                );
                const isPaused = subscription.actions?.find(
                  (action) => action.type === "PAUSE"
                );
                const isDueToBeCancelled = subscription.actions?.find(
                  (action) => action.type === "CANCEL"
                );
                return (
                  <div className="my-2 flex w-full items-center justify-between rounded-xl border border-text-secondary sm:grid sm:grid-cols-3">
                    <div className="flex items-start justify-between py-6">
                      <p className="px-2 text-sm font-medium leading-5 text-text-primary">
                        {thisPlan?.subscriptionPlanData?.name}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm font-medium">Status:</span>
                      <p className="text-sm leading-5 text-text-secondary">
                        {isDueToBeCancelled
                          ? "Cancelling"
                          : isPaused
                          ? "Paused"
                          : "Active"}
                      </p>
                    </div>
                    <div className="flex h-full flex-col items-center justify-center gap-2 place-self-end py-1 pr-2">
                      <>
                        {isPaused && !isDueToBeCancelled ? (
                          <button
                            className="rounded-lg border border-text-secondary px-2 py-2 text-sm font-medium leading-5 text-text-primary hover:text-text-secondary"
                            onClick={() =>
                              handleResumeSubscription(subscription)
                            }
                          >
                            Resume
                          </button>
                        ) : (
                          !isPaused &&
                          !isDueToBeCancelled && (
                            <>
                              <button
                                className="rounded-lg border border-text-secondary px-2 py-2 text-sm font-medium leading-5 text-text-primary hover:text-text-secondary"
                                onClick={() =>
                                  handlePauseSubscription(subscription)
                                }
                              >
                                Pause
                              </button>
                              <button
                                className="rounded-lg border border-text-secondary bg-button px-2 py-2 text-sm font-medium  leading-5 text-white hover:text-text-secondary"
                                onClick={() =>
                                  handleCancelSubscription(subscription)
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )
                        )}
                      </>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              You have no subscriptions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;
