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
    .min(2, { message: "Company must be at least two characters long." })
    .max(25, {
      message: "Company must be at most twenty-five characters long.",
    })
    .optional(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least eight characters long." })
    .max(10, { message: "Phone number must be at most ten characters long." }),
  streetAddress: z
    .string()
    .min(2, { message: "Street address must be at least two characters long." })
    .max(40, {
      message: "Street address must be at most fourty characters long.",
    }),
  apartmentorUnit: z
    .string()
    .min(1, {
      message: "Apartment or unit must be at least two characters long.",
    })
    .max(5, {
      message: "Apartment or unit must be at most ten characters long.",
    })
    .optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least two characters long." })
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
  emailNotifications: z.boolean(),
  emailNewsletter: z.boolean(),
  emailPromotions: z.boolean(),
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
                <FormField form={userProfileForm} field="First Name" />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <FormField form={userProfileForm} field="Last Name" />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <FormField form={userProfileForm} field="Company" />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <FormField form={userProfileForm} field="Email" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField form={userProfileForm} field="Street Address" />
                {/* <label
                  htmlFor="street-address"
                  className="block text-sm font-medium text-text-primary"
                >
                  Street address
                </label>
                <div className="col-span-1 sm:col-span-2">
                  <Autocomplete<
                    ReactGoogleAutocompleteInputProps & {
                      value: string;
                    }
                  >
                    apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                    onPlaceSelected={(place) => {
                      const apartmentOrUnit = place?.address_components?.find(
                        (component) => component.types.includes("subpremise")
                      );

                      const streetNumber = place?.address_components?.find(
                        (component) => component.types.includes("street_number")
                      );
                      const streetAddress = place?.address_components?.find(
                        (component) => component.types.includes("route")
                      );
                      const city = place?.address_components?.find(
                        (component) => component.types.includes("locality")
                      );
                      const state = place?.address_components?.find(
                        (component) =>
                          component.types.includes(
                            "administrative_area_level_1"
                          )
                      );
                      const country = place?.address_components?.find(
                        (component) => component.types.includes("country")
                      );
                      const postalCode = place?.address_components?.find(
                        (component) => component.types.includes("postal_code")
                      );

                      setUserObj({
                        ...userObj,
                        streetNumber: streetNumber?.long_name as string,
                        streetAddress: streetNumber?.long_name
                          ? `${streetNumber?.long_name} ${streetAddress?.long_name}`
                          : `${streetAddress?.long_name}`,
                        apartmentOrUnit: apartmentOrUnit
                          ? apartmentOrUnit?.long_name
                          : "",
                        city: city?.long_name as string,
                        state: state?.short_name as string,
                        country: country?.long_name as string,
                        postalCode: postalCode?.long_name as string,
                      });
                    }}
                    options={{
                      componentRestrictions: { country: "au" },
                      fields: ["address_components", "formatted_address"],
                      types: ["address"],
                    }}
                    {...register("street-address")}
                    id="street-address"
                    //defaultValue={userObj?.streetAddress as string}
                    value={userObj?.streetAddress as string}
                    inputAutocompleteValue={userObj?.streetAddress as string}
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        streetAddress: (e.target as HTMLTextAreaElement).value,
                      });
                    }}
                    className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary focus:border-text-primary focus:ring focus:ring-text-primary sm:text-sm"
                  />
                  <input
                    hidden
                    id="street-address"
                    ref={streetAddressRef}
                    type="text"
                    value={userObj?.streetAddress as string}
                    autoComplete="off"
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        streetAddress: (e.target as HTMLInputElement).value,
                      });
                    }}
                  /> */}
                {/* </div> */}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <FormField form={userProfileForm} field="Apartment or Unit" />
              </div>

              <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                <FormField form={userProfileForm} field="City" />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <FormField form={userProfileForm} field="State" />
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                <FormField form={userProfileForm} field="Post Code" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <FormField form={userProfileForm} field="Country" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium text-text-primary"
                >
                  Contact Phone Number
                </label>
                <input
                  id="tel"
                  {...register("tel")}
                  autoComplete="tel"
                  type={userObj.phoneNumber ? "text" : "tel"}
                  defaultValue={userObj.phoneNumber as string}
                  className="mt-1 block w-full rounded-md border border-text-secondary bg-white p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:outline-none focus:ring focus:ring-text-primary sm:text-sm"
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
