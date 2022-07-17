import FormField from "@/components/CheekyBox/Pages/CheekyBoxForm/FormField";
import { User } from "@prisma/client";
import { useRef } from "react";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { FieldValues, UseFormRegister, UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least two characters long." })
    .max(20, { message: "First name must be at most twenty characters long." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least two characters long." })
    .max(25, {
      message: "Last name must be at most twenty-five characters long.",
    }),
  company: z
    .string()
    .max(25, {
      message: "Company must be at most twenty-five characters long.",
    })
    .optional()
    .nullable(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least eight characters long." })
    .max(12, { message: "Phone number must be at most ten characters long." }),
  streetAddress: z
    .string()
    .min(2, { message: "Street address must be at least two characters long." })
    .max(40, {
      message: "Street address must be at most fourty characters long.",
    }),
  apartmentorUnit: z
    .string()
    .max(5, {
      message: "Apartment or unit must be at most ten characters long.",
    })
    .optional(),
  city: z
    .string()
    .min(0, { message: "City must be at least two characters long." })
    .max(25, { message: "City must be at most twenty-five characters long." }),
  state: z
    .string()
    .min(3, { message: "State must be at least three characters long." })
    .max(3, { message: "State must be at most three characters long." }),
  postCode: z
    .string()
    .min(4, { message: "Post Code must contain four numbers" })
    .max(4, { message: "Post Code must contain four numbers" }),
  country: z.literal("Australia", {
    invalid_type_error: "Country must be Australia",
  }),
  essentialNotifications: z.boolean(),
  newsletters: z.boolean(),
  promotions: z.boolean(),
});

const UserInfoForm = ({
  userObj,
  setUserObj,
  register,
  userProfileForm,
}: {
  userObj: User;
  setUserObj: Function;
  register: UseFormRegister<FieldValues>;
  userProfileForm: UseFormReturn<any>;
}) => {
  const streetAddressRef = useRef<HTMLInputElement>(null);
  return (
    <div className="m-2 rounded-md bg-white px-4 py-5 shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-2">
                <FormField
                  form={userProfileForm}
                  field="First Name"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <FormField
                  form={userProfileForm}
                  field="Last Name"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <FormField
                  form={userProfileForm}
                  field="Company"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <FormField
                  form={userProfileForm}
                  field="Email"
                  user={userObj}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  form={userProfileForm}
                  field="Street Address"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <FormField
                  form={userProfileForm}
                  field="Apartment or Unit"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <FormField form={userProfileForm} field="City" user={userObj} />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <FormField
                  form={userProfileForm}
                  field="State"
                  user={userObj}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <FormField
                  form={userProfileForm}
                  field="Post Code"
                  user={userObj}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  form={userProfileForm}
                  field="Country"
                  user={userObj}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField
                  form={userProfileForm}
                  field="Phone Number"
                  user={userObj}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
