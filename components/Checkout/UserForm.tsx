import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { useRef } from "react";
import { User } from "@prisma/client";
import { validationErrors } from "@/pages/checkout";

const UserForm = ({
  userObj,
  setUserObj,
  termsAccepted,
  setTermsAccepted,
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
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {userObj && (
        <form
          autoComplete="off"
          className="mt-4 w-full font-gothic text-text-primary"
        >
          <input type="hidden" defaultValue="something" />
          <div>
            <h2 className="text-lg font-medium ">Billing Contact</h2>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-text-primary"
                >
                  First name
                </label>
                <div className="relative mt-1">
                  <div>
                    {validationErrors.name && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    autoComplete="given-name"
                    defaultValue={userObj?.firstName as string}
                    onChange={(e) => {
                      setValidationErrors({ ...validationErrors, name: false });
                      setUserObj({
                        ...userObj,
                        firstName: e.target.value,
                      });
                    }}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                    id="last-name"
                    name="last-name"
                    autoComplete="family-name"
                    defaultValue={userObj?.lastName as string}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        lastName: e.target.value,
                      })
                    }
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                <div className="relative mt-1">
                  <div>
                    {validationErrors.email && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
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
                      setValidationErrors({
                        ...validationErrors,
                        email: false,
                      });
                      setUserObj({
                        ...userObj,
                        email: e.target.value,
                      });
                    }}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                    name="company"
                    id="company"
                    autoComplete="organization"
                    defaultValue={userObj?.company as string}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        company: e.target.value,
                      })
                    }
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="relative">
                  {validationErrors.streetAddress && (
                    <span className="absolute top-4 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
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
                    const country = place?.address_components?.find(
                      (component) => component.types.includes("country")
                    );
                    const postalCode = place?.address_components?.find(
                      (component) => component.types.includes("postal_code")
                    );

                    setUserObj((userObj: User) => {
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
                  {...register("street-address")}
                  id="street-address"
                  //defaultValue={userObj?.streetAddress as string}
                  value={userObj?.streetAddress as string}
                  inputAutocompleteValue={userObj?.streetAddress as string}
                  onChange={(e) => {
                    setValidationErrors(
                      (validationErrors: any) => {
                        return { ...validationErrors, streetAddress: false };
                      },
                      [validationErrors.streetAddress]
                    );
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
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                <div className="relative mt-1">
                  <div>
                    {validationErrors.city && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    {...(register("guest-city"),
                    {
                      required: true,
                      value: userObj.city ? (userObj.city as string) : "",
                      onChange: (e) => {
                        setValidationErrors(
                          (validationErrors: any) => {
                            return { ...validationErrors, city: false };
                          },
                          [validationErrors.city]
                        );
                        setUserObj({
                          ...userObj,
                          city: e.target.value,
                        });
                      },
                    })}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                    id="country"
                    {...register("country")}
                    autoComplete="country-name"
                    value={userObj?.country ? (userObj.country as string) : ""}
                    onChange={(e) => {
                      setUserObj({
                        ...userObj,
                        country: e.target.value,
                      });
                    }}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                <div className="relative mt-1">
                  <div>
                    {validationErrors.state && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <select
                    {...(register("guest-region"),
                    {
                      value: (userObj.state as string) || "",
                      onChange: (e) =>
                        setUserObj({ ...userObj, state: e.target.value }),
                    })}
                    id="guest-region"
                    autoComplete="address-level1"
                    className="mt-1 block w-full rounded-md border border-text-secondary p-1 py-1.5 text-text-primary focus:border-text-primary focus:ring focus:ring-text-primary sm:text-sm"
                  >
                    <option></option>
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
                <div className="relative mt-1">
                  <div>
                    {validationErrors.zip && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    {...(register("postal-code"),
                    {
                      value: userObj?.postalCode
                        ? (userObj.postalCode as string)
                        : "",
                      onChange: (e) => {
                        setValidationErrors({
                          ...validationErrors,
                          zip: false,
                        });
                        setUserObj({
                          ...userObj,
                          postalCode: e.target.value,
                        });
                      },
                      maxLength: 4,
                      required: true,
                      pattern: "/^[0-9]{4}$/",
                    })}
                    maxLength={4}
                    id="postal-code"
                    autoComplete="postal-code"
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                <div className="relative mt-1">
                  <div>
                    {validationErrors.phone && (
                      <span className="absolute -top-2 right-0 rounded-sm bg-white px-1 font-gothic text-xs text-red-500 sm:text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <input
                    id="tel"
                    {...register("tel")}
                    autoComplete="tel"
                    type={userObj.phoneNumber ? "text" : "tel"}
                    defaultValue={userObj.phoneNumber as string}
                    onChange={(e) => {
                      setValidationErrors((validationErrors: any) => {
                        return { ...validationErrors, phone: false };
                      });
                      setUserObj({
                        ...userObj,
                        phoneNumber: e.target.value,
                      });
                    }}
                    className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col space-x-2 space-y-2">
            <div className="flex items-center space-x-2 ">
              <input
                onChange={() =>
                  setTermsAccepted((termsAccepted: boolean) => !termsAccepted)
                }
                ref={termsCheckboxRef}
                checked={termsAccepted}
                id="terms"
                name="terms"
                type="checkbox"
                className="h-6 w-6 rounded border-text-secondary text-text-secondary accent-text-secondary focus:ring-text-secondary"
              />
              <label
                htmlFor="terms"
                className="select-none text-sm text-text-primary"
              >
                I have read the terms and conditions and privacy policy.
              </label>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default UserForm;
