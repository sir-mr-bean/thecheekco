import { UserState } from "../../context/User/userContext";
import Autocomplete from "react-google-autocomplete";
import { useState, useEffect, useRef } from "react";
import { User } from "@/types/User";
import { UserAction } from "@/context/User/userReducer";

const UserForm = ({
  userObj,
  UserDispatch,
}: {
  userObj: User;
  UserDispatch: Function;
}) => {
  const termsCheckboxRef = useRef(null);
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  return (
    <>
      {userObj && (
        <form autoComplete="off" className="mt-4 text-text-primary font-gothic">
          <input type="hidden" value="something" />
          <div className="">
            <h2 className="text-lg font-medium ">Customer Information</h2>

            <div className="mt-4 grid grid-flow-row grid-cols-1 sm:gap-y-6 sm:grid-cols-2 sm:gap-x-4">
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
                    id="first-name"
                    name="first-name"
                    autoComplete="given-name"
                    value={userObj?.firstName}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_FIRST_NAME",
                        payload: e.target.value,
                      })
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
                    id="last-name"
                    name="last-name"
                    autoComplete="family-name"
                    value={userObj?.lastName}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_LAST_NAME",
                        payload: e.target.value,
                      })
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
                    id="company"
                    autoComplete="organization"
                    value={userObj?.company}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_COMPANY",
                        payload: e.target.value,
                      })
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
                <Autocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={(places) => {
                    console.log(places);
                    if (places) {
                      const apartmentOrUnit = places?.address_components?.find(
                        (component: any) =>
                          component?.types?.includes("subpremise")
                      );
                      if (apartmentOrUnit) {
                        UserDispatch({
                          type: "SET_APARTMENT_OR_UNIT",
                          payload: apartmentOrUnit.long_name,
                        });
                      }
                      const streetNumber = places?.address_components?.find(
                        (component) => component.types.includes("street_number")
                      );
                      const streetAddress = places?.address_components?.find(
                        (component) => component.types.includes("route")
                      );
                      const city = places?.address_components?.find(
                        (component) => component.types.includes("locality")
                      );
                      const state = places?.address_components?.find(
                        (component) =>
                          component.types.includes(
                            "administrative_area_level_1"
                          )
                      );
                      const country = places?.address_components?.find(
                        (component) => component.types.includes("country")
                      );
                      const postalCode = places?.address_components?.find(
                        (component) => component.types.includes("postal_code")
                      );
                      UserDispatch({
                        type: "SET_STREET_ADDRESS",
                        payload:
                          streetNumber?.long_name +
                          " " +
                          streetAddress?.long_name,
                      });
                      UserDispatch({
                        type: "SET_CITY",
                        payload: city?.long_name,
                      });
                      UserDispatch({
                        type: "SET_STATE",
                        payload: state?.long_name,
                      });
                      UserDispatch({
                        type: "SET_COUNTRY",
                        payload: country?.long_name,
                      });
                      UserDispatch({
                        type: "SET_POSTAL_CODE",
                        payload: postalCode?.long_name,
                      });
                      UserDispatch({
                        type: "SET_STREET_NUMBER",
                        payload: streetNumber?.long_name,
                      });
                    }
                  }}
                  options={{
                    componentRestrictions: { country: "au" },
                    fields: ["place?.address_components?", "geometry"],
                    types: ["address"],
                  }}
                  ref={streetAddressRef}
                  className=" mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full shadow-sm shadow-text-secondary sm:text-sm border-text-primary rounded-md p-1 focus:ring"
                />
                <input
                  hidden
                  id="street-address"
                  ref={streetAddressRef}
                  type="text"
                  defaultValue={userObj?.streetAddress}
                  autoComplete="off"
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
                    id="apartment"
                    value={userObj?.apartmentOrUnit}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_APARTMENT_OR_UNIT",
                        payload: e.target.value,
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
                    id="city"
                    autoComplete="address-level2"
                    value={userObj?.city || ""}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_CITY",
                        payload: e.target.value,
                      })
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
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={userObj?.country}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_COUNTRY",
                        payload: e.target.value,
                      })
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
                    id="region"
                    autoComplete="address-level1"
                    value={userObj?.state}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_STATE",
                        payload: e.target.value,
                      })
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
                    id="postal-code"
                    autoComplete="postal-code"
                    value={userObj?.postalCode}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_POSTAL_CODE",
                        payload: e.target.value,
                      })
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
                    id="phone"
                    autoComplete="tel"
                    value={userObj?.phoneNumber}
                    onChange={(e) =>
                      UserDispatch({
                        type: "SET_PHONE_NUMBER",
                        payload: e.target.value,
                      })
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
                id="terms"
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

export default UserForm;
