import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import type { validationErrors } from "@/pages/checkout";
import { BsChevronDown } from "react-icons/bs";

const GuestForm = ({
  termsAccepted,
  setTermsAccepted,
  userObj,
  setUserObj,
  register,
  validationErrors,
  setValidationErrors,
}: {
  userObj: User;
  setUserObj: Function;
  termsAccepted: boolean;
  setTermsAccepted: Function;
  register: Function;
  validationErrors: validationErrors;
  setValidationErrors: Function;
}) => {
  const termsCheckboxRef = useRef(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);

  return (
    <form
      autoComplete="off"
      className="mt-4 text-text-primary font-gothic w-full appearance-none"
    >
      <input type="hidden" defaultValue="something" />
      <div className="">
        <h2 className="text-lg font-medium ">Billing Contact</h2>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-text-primary"
            >
              First name
            </label>
            <div className="mt-1 relative">
              <div>
                {validationErrors.name && (
                  <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                    This field is required
                  </span>
                )}
              </div>
              <input
                type="text"
                id="guest-first-name"
                {...(register("guest-first-name"),
                {
                  required: true,
                  minLength: 2,
                  maxLength: 20,
                  value: userObj.firstName as string,
                  onChange: (e) => {
                    setValidationErrors({ ...validationErrors, name: false });
                    setUserObj({ ...userObj, firstName: e.target.value });
                  },
                })}
                autoComplete="given-name"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-text-primary"
            >
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="guest-last-name"
                {...(register("guest-last-name"),
                {
                  required: true,
                  value: userObj.lastName as string,
                  onChange: (e) =>
                    setUserObj({ ...userObj, lastName: e.target.value }),
                })}
                autoComplete="family-name"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary"
            >
              Email Address
            </label>
            <div className="mt-1 relative">
              <div>
                {validationErrors.email && (
                  <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                    This field is required
                  </span>
                )}
              </div>
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                defaultValue={userObj?.email as string}
                onChange={(e) => {
                  setValidationErrors({ ...validationErrors, email: false });
                  setUserObj({
                    ...userObj,
                    email: e.target.value,
                  });
                }}
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-text-primary"
            >
              Company
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...(register("guest-company"),
                {
                  value: userObj.company as string,
                  onChange: (e) =>
                    setUserObj({ ...userObj, company: e.target.value }),
                })}
                id="guest-company"
                autoComplete="organization"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 ">
            <div className="relative">
              {validationErrors.streetAddress && (
                <span className="text-red-500 text-xs sm:text-sm absolute top-4 right-0 bg-white rounded-sm px-1 font-gothic">
                  This field is required
                </span>
              )}
            </div>
            <label
              htmlFor="street-address"
              className="block text-sm font-medium text-text-primary"
            >
              Street address
            </label>
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
                const city = place?.address_components?.find((component) =>
                  component.types.includes("locality")
                );
                const state = place?.address_components?.find((component) =>
                  component.types.includes("administrative_area_level_1")
                );
                const country = place?.address_components?.find((component) =>
                  component.types.includes("country")
                );
                const postalCode = place?.address_components?.find(
                  (component) => component.types.includes("postal_code")
                );

                setUserObj((userObj) => {
                  return {
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
                  };
                });
              }}
              options={{
                componentRestrictions: { country: "au" },
                fields: ["address_components", "formatted_address"],
                types: ["address"],
              }}
              {...register("guest-street-address")}
              id="street-address"
              //defaultValue={userObj?.streetAddress as string}
              value={userObj.streetAddress as string}
              onChange={(e) => {
                setValidationErrors(
                  (validationErrors) => {
                    return { ...validationErrors, streetAddress: false };
                  },
                  [validationErrors.streetAddress]
                );
                setUserObj((userObj) => {
                  return {
                    ...userObj,
                    streetAddress: (e.target as HTMLTextAreaElement).value,
                  };
                });
              }}
              inputAutocompleteValue={userObj?.streetAddress as string}
              className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
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

          <div className="sm:col-span-2">
            <label
              htmlFor="apartment"
              className="block text-sm font-medium text-text-primary"
            >
              Apartment, suite, etc.
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register("guest-apartment")}
                id="guest-apartment"
                value={userObj.apartmentOrUnit as string}
                onChange={(e) =>
                  setUserObj({
                    ...userObj,
                    apartmentOrUnit: e.target.value,
                  })
                }
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-text-primary"
            >
              City
            </label>
            <div className="mt-1 relative">
              <div>
                {validationErrors.city && (
                  <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                    This field is required
                  </span>
                )}
              </div>
              <input
                type="text"
                {...(register("guest-city"),
                {
                  required: true,
                  value: (userObj.city as string) || "",
                  onChange: (e) => {
                    setValidationErrors(
                      (validationErrors) => {
                        return { ...validationErrors, city: false };
                      },
                      [validationErrors.city]
                    );
                    setUserObj({
                      ...userObj,
                      city: e.target.value,
                    });
                  },
                  validate: {
                    matchesFormatOfCityName: (value) =>
                      value.match(/^[a-zA-Z ]+$/),
                  },
                })}
                id="guest-city"
                autoComplete="address-level2"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-text-primary"
            >
              Country
            </label>
            <div className="mt-1">
              <select
                id="guest-country"
                {...(register("guest-country"),
                {
                  value: (userObj.country as string) || "",
                  onChange: (e) =>
                    setUserObj({ ...userObj, country: e.target.value }),
                })}
                autoComplete="country-name"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 py-1.5 focus:ring appearance-none"
              >
                <option>Australia</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-text-primary"
            >
              State
            </label>
            <div className="mt-1 relative w-full">
              <div className="inset-y-0 right-0 flex items-center pr-4 absolute text-text-primary">
                <BsChevronDown />
              </div>
              <select
                {...(register("guest-region"),
                {
                  value: (userObj.state as string) || "ACT",
                  onChange: (e) =>
                    setUserObj({ ...userObj, state: e.target.value }),
                })}
                id="guest-region"
                autoComplete="address-level1"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none bg-white"
              >
                <option>ACT</option>
                <option>NSW</option>
                <option>NT</option>
                <option>QLD</option>
                <option>SA</option>
                <option>TAS</option>
                <option>VIC</option>
                <option>WA</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium text-text-primary"
            >
              Post code
            </label>
            <div className="mt-1 relative">
              <div>
                {validationErrors.zip && (
                  <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                    This field is required
                  </span>
                )}
              </div>
              <input
                type="text"
                {...(register("guest-postal-code"),
                {
                  value: userObj?.postalCode
                    ? (userObj.postalCode as string)
                    : "",
                  onChange: (e) => {
                    setValidationErrors((validationErrors) => {
                      return { ...validationErrors, zip: false };
                    });
                    setUserObj({
                      ...userObj,
                      postalCode: e.target.value,
                    });
                  },
                  maxLength: 4,
                  required: true,
                  pattern: "/^[0-9]{4}$/",
                  validate: {
                    correct: (value) =>
                      value.length === 4 || "Invalid post code",
                  },
                })}
                id="guest-postal-code"
                autoComplete="postal-code"
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-text-primary"
            >
              Phone
            </label>
            <div className="mt-1 relative">
              <div>
                {validationErrors.phone && (
                  <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
                    This field is required
                  </span>
                )}
              </div>
              <input
                type="text"
                {...register("guest-phone")}
                id="guest-phone"
                autoComplete="tel"
                value={userObj.phoneNumber as string}
                onChange={(e) => {
                  setValidationErrors((validationErrors) => {
                    return { ...validationErrors, phone: false };
                  });
                  setUserObj({
                    ...userObj,
                    phoneNumber: e.target.value,
                  });
                }}
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-secondary block w-full border sm:text-sm border-text-secondary rounded-md p-1 focus:ring appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-2 space-y-2 flex-col">
        <div className="mt-6 flex space-x-2 space-y-2 flex-col">
          <div className="flex items-center space-x-2 ">
            <input
              onChange={() => setTermsAccepted(!termsAccepted)}
              ref={termsCheckboxRef}
              checked={termsAccepted}
              id="terms"
              name="terms"
              type="checkbox"
              className="h-6 w-6 border-gray-300 rounded text-text-secondary focus:ring-text-secondary accent-text-secondary"
            />
            <label
              htmlFor="terms"
              className="text-sm text-text-primary select-none"
            >
              I have read the terms and conditions and privacy policy.
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default GuestForm;
