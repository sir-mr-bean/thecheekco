import { useState, useEffect, ReactHTMLElement, useRef } from "react";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import MySubscriptions from "./UserInfo/MySubscriptions";

type FormData = {
  [x: string]: any;
};

const UserInfo = ({ session }: { session: Session }) => {
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [userObj, setUserObj] = useState<User>(session?.user as User);
  const updateUser = trpc.useMutation(["userupdateUser"]);
  const { data: mySubscriptions, status } = trpc.useQuery([
    "square-subscription.get-my-subscriptions",
  ]);
  const { data: allPlans, status: planStatus } = trpc.useQuery([
    "square-subscription.get-all-subscriptions",
  ]);
  console.log(mySubscriptions);

  const dateSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date());
  type DateSchema = z.infer<typeof dateSchema>;

  const handleFormSubmit = async (d: FormData) => {
    const updatedUserObj = {
      id: userObj.id,
      createdAt: userObj.createdAt as DateSchema,
      updatedAt: new Date(Date.now()),
      name: d["first-name"] + " " + d["last-name"],
      email: userObj.email,
      emailVerified: userObj.emailVerified,
      image: userObj.image,
      firstName: d["first-name"],
      lastName: d["last-name"],
      company: d.organization,
      streetAddress: userObj.streetAddress,
      streetNumber: d["apartment-unit"],
      apartmentOrUnit: d["apartment-unit"],
      city: d.city,
      state: d.region,
      country: d.country,
      postalCode: d["postal-code"],
      phoneNumber: d.tel,
      isAdmin: userObj.isAdmin,
    };

    const userUpdate = updateUser.mutate(
      {
        email: userObj.email,
        user: updatedUserObj,
      },
      {
        onSuccess: (data) => {
          toast.success("Profile updated successfully");
        },
      }
    );
  };

  //mutation.mutate({ email: d.email, user: d });

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
        <div className="m-2 rounded-md bg-white px-4 py-5 shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      {...register("first-name")}
                      id="first-name"
                      autoComplete="given-name"
                      defaultValue={userObj?.firstName as string}
                      className="mt-1 block w-full appearance-none rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      {...register("last-name")}
                      id="last-name"
                      autoComplete="family-name"
                      defaultValue={userObj?.lastName as string}
                      className="mt-1 block w-full appearance-none rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      {...register("organization")}
                      id="organization"
                      autoComplete="organization"
                      defaultValue={userObj?.company as string}
                      className="mt-1 block w-full appearance-none rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      {...register("email-address")}
                      id="email-address"
                      autoComplete="email"
                      defaultValue={userObj?.email as string}
                      className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
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
                          const apartmentOrUnit =
                            place?.address_components?.find((component) =>
                              component.types.includes("subpremise")
                            );

                          const streetNumber = place?.address_components?.find(
                            (component) =>
                              component.types.includes("street_number")
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
                            (component) =>
                              component.types.includes("postal_code")
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
                        inputAutocompleteValue={
                          userObj?.streetAddress as string
                        }
                        onChange={(e) => {
                          setUserObj({
                            ...userObj,
                            streetAddress: (e.target as HTMLTextAreaElement)
                              .value,
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
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="apartment-unit"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Apartment/Unit
                    </label>
                    <input
                      type="text"
                      {...register("apartment-unit")}
                      id="apartment-unit"
                      autoComplete="address-line1"
                      value={
                        userObj.apartmentOrUnit
                          ? (userObj?.apartmentOrUnit as string)
                          : ""
                      }
                      onChange={(e) => {
                        setUserObj({
                          ...userObj,
                          apartmentOrUnit: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-text-primary"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      id="city"
                      autoComplete="address-level2"
                      value={userObj?.city ? (userObj.city as string) : ""}
                      onChange={(e) => {
                        setUserObj({
                          ...userObj,
                          city: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-text-primary"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      {...register("region")}
                      id="region"
                      autoComplete="address-level1"
                      value={userObj?.state ? (userObj.state as string) : ""}
                      onChange={(e) => {
                        setUserObj({
                          ...userObj,
                          state: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Post code
                    </label>
                    <input
                      type="text"
                      {...register("postal-code")}
                      id="postal-code"
                      autoComplete="postal-code"
                      value={
                        userObj?.postalCode
                          ? (userObj.postalCode as string)
                          : ""
                      }
                      onChange={(e) => {
                        setUserObj({
                          ...userObj,
                          postalCode: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      {...register("country")}
                      autoComplete="country-name"
                      value={
                        userObj?.country ? (userObj.country as string) : ""
                      }
                      onChange={(e) => {
                        setUserObj({
                          ...userObj,
                          country: e.target.value,
                        });
                      }}
                      className="mt-1 block w-full rounded-md border border-text-secondary bg-white p-1 text-text-primary shadow-text-secondary focus:border-text-secondary focus:outline-none focus:ring focus:ring-text-primary sm:text-sm"
                    >
                      <option>Australia</option>
                    </select>
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

        {/* My Subscriptions Panel */}
        <MySubscriptions
          mySubscriptions={mySubscriptions}
          allPlans={allPlans}
        />

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
                          Get notified when someones posts a comment on a
                          posting.
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
                          Get notified when a candidate accepts or rejects an
                          offer.
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
                <div className="m-2 flex justify-end sm:m-6">
                  <button
                    type="button"
                    className="rounded-md border border-text-secondary bg-white py-2 px-4 text-sm font-medium text-text-primary shadow-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 "
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleFormSubmit)}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-button py-2 px-4 text-sm font-medium  text-text-primary shadow-text-secondary hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
