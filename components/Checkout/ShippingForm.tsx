import { User } from "@prisma/client";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import type { userShippingObject, validationErrors } from "@/pages/checkout";
import { useRef } from "react";

const ShippingForm = ({
  userShippingObj,
  setUserShippingObj,
  shippingInfoCheckboxRef,
  setSameAsCustomerInfo,
  sameAsCustomerInfo,
  userObj,
  setUserObj,
  register,
}: {
  userShippingObj: userShippingObject;
  setUserShippingObj: Function;
  shippingInfoCheckboxRef: React.RefObject<HTMLInputElement>;
  setSameAsCustomerInfo: (sameAsCustomerInfo: boolean) => void;
  sameAsCustomerInfo: boolean;
  userObj: User;
  setUserObj: Function;
  register: Function;
}) => {
  const streetAddressRef = useRef<HTMLInputElement>(null);
  return (
    <form className="mt-4 w-full font-gothic text-text-primary">
      <div className="">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium ">Shipping Contact</h2>
          <div className="flex items-center space-x-2 ">
            <input
              onChange={() => setSameAsCustomerInfo(!sameAsCustomerInfo)}
              ref={shippingInfoCheckboxRef}
              id="sameAsCustomerInfo"
              name="sameAsCustomerInfo"
              type="checkbox"
              className="h-5 w-5 rounded border-text-secondary text-text-secondary accent-text-secondary checked:bg-text-secondary focus:ring-text-secondary"
            />
            <label
              htmlFor="sameAsCustomerInfo"
              className="select-none text-xs text-text-primary"
            >
              Same as Billing Contact
            </label>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-text-primary"
            >
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="first-name"
                name="first-name"
                autoComplete="given-name"
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.firstName as string)
                    : (userShippingObj.firstName as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    firstName: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.lastName as string)
                    : (userShippingObj.lastName as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    lastName: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
            <div className="mt-1">
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.email as string)
                    : (userShippingObj.email as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    email: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.company as string)
                    : (userShippingObj.company as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    company: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-text-primary"
            >
              Address
            </label>
            <div className="mt-1">
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
                  console.log("found place!");
                  console.log(place);

                  // streetNumber: "",
                  // streetAddress: "",
                  // apartmentOrUnit: "",
                  // city: "",
                  // state: "ACT",
                  // country: "Australia",
                  // postalCode: "",
                  // phoneNumber: "",
                  setUserShippingObj((userShippingObj: userShippingObject) => {
                    return {
                      ...userShippingObj,
                      streetNumber: streetNumber?.long_name as string,
                      streetAddress: streetNumber?.long_name
                        ? `${streetNumber?.long_name} ${streetAddress?.long_name}`
                        : `${streetAddress?.long_name}`,
                      apartmentOrUnit: apartmentOrUnit
                        ? apartmentOrUnit?.long_name
                        : "",
                      city: city?.long_name as string,
                      state: state?.short_name as string,
                      country: "Australia",
                      postalCode: postalCode?.long_name as string,
                    } as userShippingObject;
                  });
                }}
                options={{
                  componentRestrictions: { country: "au" },
                  fields: ["address_components", "formatted_address"],
                  types: ["address"],
                }}
                {...register("guest-street-address")}
                id="guest-street-address"
                //defaultValue={userObj?.streetAddress as string}
                value={userShippingObj.streetAddress as string}
                onChange={(e) => {
                  setUserShippingObj({
                    ...userShippingObj,
                    streetAddress: (e.target as HTMLTextAreaElement).value,
                  });
                }}
                inputAutocompleteValue={
                  userShippingObj?.streetAddress as string
                }
                className="mt-1 block w-full appearance-none rounded-md border border-text-secondary p-1 text-text-primary focus:border-text-secondary focus:ring focus:ring-text-primary sm:text-sm"
              />
              <input
                hidden
                id="street-address"
                ref={streetAddressRef}
                type="text"
                value={userShippingObj?.streetAddress as string}
                autoComplete="off"
                onChange={(e) => {
                  setUserShippingObj({
                    ...userShippingObj,
                    streetAddress: (e.target as HTMLInputElement).value,
                  });
                }}
              />
            </div>
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
                name="apartment"
                id="apartment"
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.apartmentOrUnit as string)
                    : (userShippingObj.apartmentOrUnit as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    apartmentOrUnit: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
            <div className="mt-1">
              <input
                type="text"
                name="city"
                id="city"
                autoComplete="address-level2"
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.city as string)
                    : (userShippingObj.city as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    city: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
                name="country"
                autoComplete="country-name"
                disabled={sameAsCustomerInfo}
                value={
                  sameAsCustomerInfo
                    ? (userObj.country as string)
                    : (userShippingObj.country as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    country: "Australia",
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 py-1.5 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
            <div className="mt-1">
              <select
                {...(register("guest-region"),
                {
                  value: (userObj.state as string) || "ACT",
                  onChange: (e) =>
                    setUserObj({ ...userObj, state: e.target.value }),
                })}
                id="guest-region"
                disabled={sameAsCustomerInfo}
                autoComplete="address-level1"
                className="block w-full rounded-md border border-text-secondary p-1 py-1.5 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
              Postal code
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="postal-code"
                id="postal-code"
                disabled={sameAsCustomerInfo}
                autoComplete="postal-code"
                value={
                  sameAsCustomerInfo
                    ? (userObj.postalCode as string)
                    : (userShippingObj.postalCode as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    postalCode: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
            <div className="mt-1">
              <input
                type="text"
                name="phone"
                id="phone"
                disabled={sameAsCustomerInfo}
                autoComplete="tel"
                value={
                  sameAsCustomerInfo
                    ? (userObj.phoneNumber as string)
                    : (userShippingObj.phoneNumber as string)
                }
                onChange={(e) =>
                  setUserShippingObj({
                    ...userShippingObj,
                    phoneNumber: e.target.value,
                  })
                }
                className="block w-full rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ShippingForm;
