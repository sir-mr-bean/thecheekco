import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { CatalogObject, Subscription } from "square";
import moment from "moment";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import PauseButton from "./PauseButton";

const MySubscriptions = ({
  mySubscriptions,
  allPlans,
  status,
}: {
  mySubscriptions: Subscription[] | undefined;
  allPlans: CatalogObject[] | undefined;
  status: string;
}) => {
  const [initialNumber, setInitialNumber] = useState(3);
  const [pausing, setPausing] = useState(false);
  const utils = trpc.useContext();
  const pauseSubscription = trpc.useMutation([
    "square-subscription.pause-subscription",
  ]);
  const resumeSubscription = trpc.useMutation([
    "square-subscription.resume-subscription",
  ]);
  const cancelSubscription = trpc.useMutation([
    "square-subscription.cancel-subscription",
  ]);
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

  const earliestResumeDate = (subscription: Subscription) => {
    const now = moment();
    const pausedUntil = moment(
      subscription.actions?.find((action) => action.type === "PAUSE")
        ?.effectiveDate
    );

    const nextBillingDate = moment(subscription.chargedThroughDate);
    const diff = pausedUntil.diff(now, "days");
    if (diff <= 0) {
      return now.add(1, "days").format("YYYY-MM-DD");
    }
    return nextBillingDate.format("YYYY-MM-DD");
  };

  const handleResumeSubscription = (subscription: Subscription) => {
    resumeSubscription.mutate(
      {
        subscriptionId: subscription.id as string,
        date: earliestResumeDate(subscription),
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
              {mySubscriptions
                .filter((subscription, i) => i < initialNumber)
                .map((subscription) => {
                  console.log(subscription);
                  const thisPlan = allPlans?.find(
                    (plan) => plan.id === subscription.planId
                  );
                  const isPaused = subscription.actions?.find(
                    (action) => action.type === "PAUSE"
                  );
                  const isDueToBeCancelled = subscription.actions?.find(
                    (action) => action.type === "CANCEL"
                  );
                  const dueToBeResumed = subscription.actions?.find(
                    (action) => action.type === "RESUME"
                  );
                  return (
                    <div className="my-2 flex w-full flex-col items-center justify-center rounded-xl border border-text-secondary sm:grid sm:grid-cols-3 sm:justify-between">
                      <div className="flex items-start justify-between py-6">
                        <p className="px-2 text-sm font-medium leading-5 text-text-primary">
                          {thisPlan?.subscriptionPlanData?.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm font-medium">Status:</span>
                        <p className="whitespace-nowrap text-xs leading-5 text-text-secondary lg:text-sm">
                          {isDueToBeCancelled
                            ? `Cancelled on ${moment(
                                subscription.canceledDate
                              ).format("MMM DD, YYYY")}`
                            : isPaused
                            ? `Paused until ${moment(
                                dueToBeResumed?.effectiveDate
                              ).format("MMM Do YYYY")}`
                            : "Active"}
                        </p>
                      </div>
                      <div className="flex h-full w-full items-center justify-center gap-2 place-self-end py-1 pr-2 sm:w-fit">
                        <>
                          {!isPaused && !isDueToBeCancelled && (
                            <div className="flex flex-col gap-1 pt-4 sm:pt-0">
                              <div className="flex gap-1">
                                <PauseButton
                                  subscription={subscription}
                                  duration={1}
                                  handlePauseSubscription={
                                    handlePauseSubscription
                                  }
                                />
                                <PauseButton
                                  subscription={subscription}
                                  duration={2}
                                  handlePauseSubscription={
                                    handlePauseSubscription
                                  }
                                />
                              </div>
                              <button
                                className="rounded-lg border border-text-secondary bg-button px-2 py-2 text-xs font-semibold leading-5 text-white hover:text-text-secondary"
                                onClick={() =>
                                  handleCancelSubscription(subscription)
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  );
                })}
              {initialNumber < mySubscriptions.length ? (
                <div className="flex w-full items-center justify-end">
                  <button
                    className="rounded-lg border border-text-secondary px-2 py-2 text-xs font-semibold leading-5 text-text-primary hover:border-white hover:bg-button hover:text-white"
                    onClick={() => setInitialNumber(mySubscriptions.length)}
                  >
                    Show More
                  </button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-end">
                  <button
                    className="rounded-lg border border-text-secondary px-2 py-2 text-xs font-semibold leading-5 text-text-primary hover:border-white hover:bg-button hover:text-white"
                    onClick={() => setInitialNumber(3)}
                  >
                    Show Less
                  </button>
                </div>
              )}
            </>
          ) : status === "loading" ? (
            <>
              <div className="mx-auto flex h-full w-full items-center justify-center  text-text-primary">
                <BeatLoader
                  color="#602d0d"
                  loading={status === String("loading")}
                  size={8}
                />
              </div>
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
