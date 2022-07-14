import { UseFormReturn } from "react-hook-form";
import Autocomplete, {
  ReactGoogleAutocompleteInputProps,
} from "react-google-autocomplete";
import { useEffect, useRef } from "react";

const FormField = ({
  form,
  field,
}: {
  form: UseFormReturn<any>;
  field: string;
}) => {
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const methodName =
    `${field}`.replace(/\s+/g, "").charAt(0).toLowerCase() +
    `${field}`.replace(/\s+/g, "").slice(1);

  useEffect(() => {
    if (streetAddressRef.current) {
      streetAddressRef.current.value = form.getValues()[methodName] || "";
    }
  }, [form.getValues()[methodName]]);

  return (
    <div>
      <label
        htmlFor={`${field}`}
        className="block text-sm font-medium capitalize text-text-primary"
      >
        {field}
      </label>
      <div className="relative mt-1">
        {methodName === "state" ? (
          <select
            {...form.register(methodName)}
            id={field}
            className="mt-1 block w-full overflow-y-scroll rounded-md border border-text-secondary p-1 py-1.5 text-text-primary focus:border-text-primary focus:ring-text-primary sm:text-sm"
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
        ) : methodName === "message" ? (
          <div className="focus:shadow-outline-blue relative mt-1 flex w-full rounded-md border px-3 py-2 shadow-sm shadow-text-primary transition duration-150 ease-in-out focus:border-text-primary focus:outline-none sm:text-sm sm:leading-5">
            <textarea
              id="message"
              {...form.register(methodName)}
              rows={4}
              className="w-full appearance-none rounded-md border border-text-secondary py-2 px-3 text-text-primary focus:border-text-primary focus:ring-text-primary sm:text-sm"
            />
          </div>
        ) : methodName === "streetAddress" ? (
          <>
            <Autocomplete<ReactGoogleAutocompleteInputProps>
              apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              onPlaceSelected={(place) => {
                console.log(place);
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
                form.setValue(
                  "streetAddress",
                  streetNumber
                    ? streetNumber.long_name + " " + streetAddress?.long_name
                    : streetAddress?.long_name,
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  }
                );
                console.log(apartmentOrUnit);

                form.setValue(
                  "apartmentorUnit",
                  apartmentOrUnit?.long_name || "",
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  }
                );
                form.setValue("city", city?.long_name, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.setValue("state", state?.short_name, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.setValue("postCode", postalCode?.long_name, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.setValue("country", country?.long_name, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              options={{
                componentRestrictions: { country: "au" },
                fields: ["address_components", "formatted_address"],
                types: ["address"],
              }}
              {...form.register(methodName)}
              ref={streetAddressRef}
              id={methodName}
              defaultValue={form.watch(methodName)}
              // onChange={(e) => {
              //   setUserObj({
              //     ...userObj,
              //     streetAddress: (e.target as HTMLTextAreaElement).value,
              //   });
              // }}
              className="mt-1 block w-full rounded-md border border-text-secondary p-1 text-text-primary focus:border-text-primary focus:ring focus:ring-text-primary sm:text-sm"
            />
            <input
              hidden
              id={field}
              type="text"
              defaultValue={form.getValues(methodName)}
              autoComplete="off"
              // onChange={(e) => {
              //   setUserObj({
              //     ...userObj,
              //     streetAddress: (e.target as HTMLInputElement).value,
              //   });
              //}}
            />
          </>
        ) : (
          <input
            type="text"
            disabled={methodName === "country"}
            id={field}
            //autoComplete="given-name"
            {...form.register(methodName)}
            //value={form.getValues()[methodName]}
            className="block w-full appearance-none rounded-md border border-text-secondary p-1 text-text-primary focus:border-text-primary focus:ring-text-primary sm:text-sm"
            onChange={(e) => form.clearErrors(methodName)}
          />
        )}
        {form.formState.errors?.[methodName]?.message && (
          <span className=" z-20 whitespace-nowrap rounded-xl bg-white px-2 py-1 text-center font-gothic text-xs text-red-500">
            {form.formState.errors?.[methodName].message}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormField;
