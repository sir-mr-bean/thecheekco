import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const GuestForm = ({
  termsAccepted,
  setTermsAccepted,
  userObj,
  setUserObj,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const termsCheckboxRef = useRef(null);
  const [firstRun, setFirstRun] = useState(true);

  return (
    <>
      {!firstRun && (
        <form
          autoComplete="off"
          className="mt-4 text-text-primary font-gothic "
        >
          <div className="">
            <h2 className="text-lg font-medium ">Billing Contact</h2>

            <div className="mt-4 grid grid-cols-2 gap-y-6 sm:gap-x-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="guest-first-name"
                    name="first-name"
                    autoComplete="given-name"
                    value={userObj.firstName}
                    onChange={(e) =>
                      setUserObj({ ...userObj, firstName: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="guest-last-name"
                    name="last-name"
                    autoComplete="family-name"
                    value={userObj.lastName}
                    onChange={(e) =>
                      setUserObj({ ...userObj, lastName: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="guest-company"
                    autoComplete="organization"
                    value={userObj.company}
                    onChange={(e) =>
                      setUserObj({ ...userObj, company: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div className="col-span-6 sm:col-span-2">
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
                      state: state?.long_name as string,
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
                  className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="apartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apartment, suite, etc.
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="apartment"
                    id="guest-apartment"
                    value={userObj.apartmentOrUnit}
                    onChange={(e) =>
                      setUserObj({
                        ...userObj,
                        apartmentOrUnit: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="guest-city"
                    autoComplete="address-level2"
                    value={userObj.city || ""}
                    onChange={(e) =>
                      setUserObj({ ...userObj, city: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="guest-country"
                    name="country"
                    autoComplete="country-name"
                    value={userObj.country}
                    onChange={(e) =>
                      setUserObj({ ...userObj, country: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  >
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="region"
                    id="guest-region"
                    autoComplete="address-level1"
                    value={userObj.state}
                    onChange={(e) =>
                      setUserObj({ ...userObj, state: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Post code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="postal-code"
                    id="guest-postal-code"
                    autoComplete="postal-code"
                    value={userObj.postalCode}
                    onChange={(e) =>
                      setUserObj({ ...userObj, postalCode: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="guest-phone"
                    autoComplete="tel"
                    value={userObj.phoneNumber}
                    onChange={(e) =>
                      setUserObj({ ...userObj, phoneNumber: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm shadow-text-secondary focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-2 space-y-2 flex-col">
            <div className="flex items-center space-x-2 ">
              <input
                onChange={() => setTermsAccepted(!termsAccepted)}
                ref={termsCheckboxRef}
                id="guest-terms"
                name="terms"
                type="checkbox"
                className="h-6 w-6 border-gray-300 rounded text-text-secondary focus:ring-text-secondary"
              />
              <label htmlFor="terms" className="text-sm text-text-primary">
                I have read the terms and conditions and agree to the sale of my
                personal information to the highest bidder.
              </label>
            </div>
            <button
              type="button"
              disabled={!termsAccepted}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm shadow-text-secondary text-sm font-medium text-white bg-button hover:border hover:border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary disabled:bg-button/50 disabled:cursor-not-allowed disabled:focus:ring-0 disabled:hover:border-transparent"
            >
              Continue
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default GuestForm;
