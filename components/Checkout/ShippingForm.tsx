import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";

const ShippingForm = ({
  userShippingObj,
  setUserShippingObj,
  shippingInfoCheckboxRef,
  setSameAsCustomerInfo,
  sameAsCustomerInfo,
  userObj,
  setUserObj,
  register,
}) => {
  return (
    <form className="mt-4 text-text-primary font-gothic w-full">
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
              className="h-5 w-5 border-text-secondary rounded checked:bg-text-secondary accent-text-secondary text-text-secondary focus:ring-text-secondary"
            />
            <label
              htmlFor="sameAsCustomerInfo"
              className="text-xs text-text-primary select-none"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                  setUserObj({
                    ...userObj,
                    email: e.target.value,
                  })
                }
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                  disabled: boolean;
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

                  setUserShippingObj({
                    ...userShippingObj,
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
                  componentRestrictions: {
                    country: "au",
                  },
                  fields: ["address_components", "formatted_address"],
                  types: ["address"],
                }}
                {...register("street-address")}
                id="street-address"
                //defaultValue={userObj?.streetAddress as string}
                value={
                  sameAsCustomerInfo
                    ? (userObj.streetAddress as string)
                    : (userShippingObj.streetAddress as string)
                }
                inputAutocompleteValue={
                  sameAsCustomerInfo
                    ? (userObj.streetAddress as string)
                    : (userShippingObj.streetAddress as string)
                }
                disabled={sameAsCustomerInfo}
                onChange={(e) => {
                  setUserShippingObj({
                    ...userShippingObj,
                    streetAddress: (e.target as HTMLTextAreaElement).value,
                  });
                }}
                className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full border sm:text-sm border-text-primary rounded-md p-1 focus:ring"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                    country: e.target.value,
                  })
                }
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 py-1.5"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1 py-1.5"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
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
                className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-sm p-1"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ShippingForm;
