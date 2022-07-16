import { useState, useEffect, ReactHTMLElement, useRef } from "react";
import { trpc } from "@/utils/trpc";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import MySubscriptions from "./UserInfo/MySubscriptions";
import UserInfoForm, { userProfileSchema } from "./UserInfo/UserInfoForm";
import UserInfoNotifications from "./UserInfo/UserInfoNotifications";
import { BeatLoader } from "react-spinners";
import { useZodForm } from "@/utils/hooks/useZodForm";

type FormData = {
  [x: string]: any;
};

const UserInfo = ({ session }: { session: Session }) => {
  const { register, handleSubmit, watch, formState } = useForm();
  const [userObj, setUserObj] = useState<User>(session?.user as User);
  const [saving, setSaving] = useState(false);
  const updateUser = trpc.useMutation(["userupdateUser"]);
  const { data: mySubscriptions, status } = trpc.useQuery([
    "square-subscription.get-my-subscriptions",
  ]);
  const { data: allPlans, status: planStatus } = trpc.useQuery([
    "square-subscription.get-all-subscriptions",
  ]);

  const userProfileForm = useZodForm({
    schema: userProfileSchema,
    shouldFocusError: true,
    defaultValues: {
      firstName: userObj.firstName || "",
      lastName: userObj.lastName || "",
      email: userObj.email || "",
      phoneNumber: userObj.phoneNumber || "",
      streetAddress: userObj.streetAddress || "",
      apartmentorUnit: userObj.apartmentOrUnit || "",
      city: userObj.city || "",
      state: userObj.state || "QLD",
      postCode: userObj.postalCode || "",
      country: "Australia",
    },
  });

  const dateSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date());
  type DateSchema = z.infer<typeof dateSchema>;

  const handleFormSubmit = (d: FormData) => {
    console.log("submitting!");
    setSaving(true);
    const formValues = userProfileForm.getValues();
    const updatedUserObj = {
      id: userObj.id,
      createdAt: userObj.createdAt as DateSchema,
      updatedAt: new Date(Date.now()),
      name: formValues.firstName + " " + formValues.lastName || "",
      email: formValues.email || "",
      emailVerified: userObj.emailVerified,
      image: userObj.image || "",
      firstName: formValues.firstName || "",
      lastName: formValues.lastName || "",
      company: formValues.company || "",
      streetAddress: formValues.streetAddress || "",
      streetNumber: formValues.streetAddress.split(" ")?.[0] || "",
      apartmentOrUnit: formValues.apartmentorUnit || "",
      city: formValues.city || "",
      state: formValues.state || "QLD",
      country: formValues.country || "Australia",
      postalCode: formValues.postCode || "",
      phoneNumber: formValues.phoneNumber || "",
      isAdmin: userObj.isAdmin || false,
    };

    const userUpdate = updateUser.mutate(
      {
        email: userObj.email,
        user: updatedUserObj,
      },
      {
        onSuccess: (data) => {
          toast.success("Profile updated successfully");
          setSaving(false);
        },
      }
    );
  };

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
          <div className="max-w-4xl py-3 sm:px-6 sm:py-4">
            <div className="px-4 sm:px-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                Account Details
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Save your details for quick checkouts.
              </p>
            </div>
          </div>
        </div>

        <UserInfoForm
          userObj={userObj}
          setUserObj={setUserObj}
          register={register}
          userProfileForm={userProfileForm}
        />
        {/* My Subscriptions Panel */}
        <MySubscriptions
          mySubscriptions={mySubscriptions}
          allPlans={allPlans}
          status={status}
        />
        <UserInfoNotifications form={userProfileForm} />
        <div className="m-2 flex justify-end rounded-md bg-white p-3 font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg">
          <button
            type="button"
            className="rounded-md border border-text-secondary bg-white py-2 px-4 text-sm font-medium text-text-primary shadow-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async (e) => {
              console.log("submitting");
              await userProfileForm.trigger();
              if (userProfileForm.formState.isValid) {
                userProfileForm.handleSubmit(handleFormSubmit)(e);
              }
            }}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium  text-text-primary shadow-text-secondary hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
          >
            {saving ? (
              <BeatLoader size={8} color="#602d0d" />
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
