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
          console.log("paused");
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
          console.log("resumed");
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
          console.log("cancelled");
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
                return (
                  <div className="my-2 flex w-full items-center justify-between rounded-xl border border-text-secondary">
                    <div className="flex items-center justify-between">
                      <p className="px-2 py-6 text-sm font-medium leading-5 text-text-primary">
                        {thisPlan?.subscriptionPlanData?.name}
                      </p>
                      <p className="text-sm leading-5 text-text-secondary"></p>
                    </div>
                    <div className="flex h-full w-fit flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => {
                          handlePauseSubscription(subscription);
                        }}
                        className="inline-flex justify-center rounded-md border border-button bg-white py-2 px-4 text-sm font-medium  text-text-secondary shadow-text-secondary hover:bg-button hover:text-white focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => {
                          handleCancelSubscription(subscription);
                        }}
                        className="inline-flex justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium  text-text-primary shadow-text-secondary hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <span>
              No subscriptions. Find your next favourite goodie{" "}
              <a href="/shop">
                {" "}
                <span className="underline decoration-text-secondary decoration-dotted underline-offset-2">
                  now
                </span>
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;
