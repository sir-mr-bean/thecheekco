import {
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { BeatLoader } from "react-spinners";
import NotificationSelection from "./NotificationSelection";

const UserInfoNotifications = ({ form }: { form: UseFormReturn<any> }) => {
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
                <NotificationSelection form={form} />
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoNotifications;
