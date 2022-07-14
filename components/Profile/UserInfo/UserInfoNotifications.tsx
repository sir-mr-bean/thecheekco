import {
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { BeatLoader } from "react-spinners";

const UserInfoNotifications = ({
  register,
  handleSubmit,
  handleFormSubmit,
  saving,
}: {
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  handleFormSubmit: (data: FieldValues) => void;
  saving: boolean;
}) => {
  return (
    <div className="m-2 rounded-md bg-white px-4 py-5 font-gothic text-text-primary shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-text-primary">
            Notifications
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Decide which communications you'd like to receive and how.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form className="space-y-6" action="#" method="POST">
            <fieldset>
              <legend className="sr-only">By Email</legend>
              <div
                className="text-base font-medium text-text-primary"
                aria-hidden="true"
              >
                By Email
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="comments"
                      {...register("comments")}
                      type="checkbox"
                      className="h-4 w-4 rounded border-text-secondary text-text-primary  focus:ring focus:ring-text-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="comments"
                      className="font-medium text-text-primary"
                    >
                      Comments
                    </label>
                    <p className="text-text-secondary">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="candidates"
                      {...register("candidates")}
                      type="checkbox"
                      className="h-4 w-4 rounded border-text-secondary text-text-primary  focus:ring focus:ring-text-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-text-primary"
                    >
                      Candidates
                    </label>
                    <p className="text-text-secondary">
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="offers"
                      {...register("offers")}
                      type="checkbox"
                      className="h-4 w-4 rounded border-text-secondary text-text-primary  focus:ring focus:ring-text-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="offers"
                      className="font-medium text-text-primary"
                    >
                      Offers
                    </label>
                    <p className="text-text-secondary">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="contents text-base font-medium text-text-primary">
                Push Notifications
              </legend>
              <p className="text-sm text-text-secondary">
                These are delivered via SMS to your mobile phone.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="push-everything"
                    {...register("push-everything")}
                    type="radio"
                    className="h-4 w-4 border-text-secondary text-text-primary focus:ring  focus:ring-text-primary"
                  />
                  <label
                    htmlFor="push-everything"
                    className="ml-3 block text-sm font-medium text-text-primary"
                  >
                    Everything
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-email"
                    {...register("push-email")}
                    type="radio"
                    className="h-4 w-4 border-text-secondary text-text-primary focus:ring focus:ring-text-primary"
                  />
                  <label
                    htmlFor="push-email"
                    className="ml-3 block text-sm font-medium text-text-primary"
                  >
                    Same as email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-nothing"
                    {...register("push-nothing")}
                    type="radio"
                    className="h-4 w-4 border-text-secondary text-text-primary focus:ring  focus:ring-text-primary"
                  />
                  <label
                    htmlFor="push-nothing"
                    className="ml-3 block text-sm font-medium text-text-primary"
                  >
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoNotifications;
