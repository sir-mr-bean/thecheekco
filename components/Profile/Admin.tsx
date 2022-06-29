import { trpc } from "@/utils/trpc";
import { Disclosure } from "@headlessui/react";
import toast from "react-hot-toast";
import { BsChevronCompactUp } from "react-icons/bs";

const Admin = () => {
  const utils = trpc.useContext();
  const { data: unapprovedReviews, status } = trpc.useQuery([
    "review.fetch-unapproved-reviews",
  ]);
  const { data: customers, status: customerStatus } = trpc.useQuery(
    [
      "review.reviewed-by",
      {
        userIds: unapprovedReviews?.map((review) => review.userId),
      },
    ],
    {
      enabled: !!unapprovedReviews,
    }
  );
  const approveReviewMutation = trpc.useMutation(["review.approve-review"]);
  const deleteReviewMutation = trpc.useMutation(["review.delete-review"]);

  const handleApproveReview = (reviewId: string) => {
    approveReviewMutation.mutate(
      {
        reviewId,
      },
      {
        onSuccess: (input) => {
          utils.invalidateQueries(["review.fetch-unapproved-reviews"]);
          toast.success("Review approved");
        },
      }
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    deleteReviewMutation.mutate(
      {
        reviewId,
      },
      {
        onSuccess: (input) => {
          utils.invalidateQueries(["review.fetch-unapproved-reviews"]);
          toast.success("Review deleted");
        },
      }
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-white sm:p-3 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow">
        <div className="max-w-4xl mx-auto py-3 sm:px-6 sm:py-4">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Check comments to be approved, view stats and more.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto text-text-primary font-gothic">
        Admin Dashboard
      </div>
      <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto text-text-primary font-gothic">
        <div className="w-full rounded-2xl bg-white p-2">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="border border-text-secondary flex w-full justify-between rounded-t-lg  px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-button focus:outline-none focus-visible:ring focus-visible:ring-text-secondary focus-visible:ring-opacity-75">
                  <span>Unapproved Reviews</span>
                  <BsChevronCompactUp
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-text-primary`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-text-primary border-x border-text-secondary border-b">
                  {unapprovedReviews && unapprovedReviews.length > 0 && (
                    <div className="flex flex-col space-y-2 w-full">
                      {unapprovedReviews
                        .filter((review) => review.comment !== "")
                        .map((review) => {
                          const reviewer = customers?.find(
                            (customer) => customer.id === review.userId
                          );
                          return (
                            <div
                              key={review.id}
                              className="flex flex-col space-y-2 w-full border border-text-secondary rounded-lg py-2"
                            >
                              <div className="flex flex-col w-full space-y-4">
                                <div className="flex space-x-2 items-center justify-center text-lg">
                                  <span>Comment by:</span>
                                  <span>{reviewer?.name}</span>
                                </div>
                                <div className="flex space-x-2 items-center justify-center text-sm">
                                  <span>Comment:</span>
                                  <span>{review.comment}</span>
                                </div>
                                <div className="flex space-x-2 items-center justify-center text-sm">
                                  <span>Rating Given:</span>
                                  <span>{review.rating.toString()}</span>
                                  <span className="pl-2">stars</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => {
                                    handleApproveReview(review.id);
                                  }}
                                  className="bg-button hover:border-black border border-transparent text-white font-bold py-1 px-4 rounded-lg flex items-center justify-center"
                                >
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteReview(review.id);
                                  }}
                                  className="bg-red-200 hover:border-black border border-transparent text-white font-bold py-1 px-4 rounded-lg flex items-center justify-center"
                                >
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="border-x border-b border-text-secondary flex w-full justify-between rounded-b-lg  px-4 py-2 text-left text-sm font-medium text-text-primary hover:bg-button focus:outline-none focus-visible:ring focus-visible:ring-text-secondary focus-visible:ring-opacity-75">
                  <span>Do you offer technical support?</span>
                  <BsChevronCompactUp
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-text-primary`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-text-primary border-x border-text-secondary border-b rounded-b-lg -translate-y-1">
                  No.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
};

export default Admin;
