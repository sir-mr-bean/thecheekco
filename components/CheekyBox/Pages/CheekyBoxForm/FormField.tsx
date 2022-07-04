import { UseFormReturn } from "react-hook-form";

const FormField = ({
  giftForm,
  field,
}: {
  giftForm: UseFormReturn<any>;
  field: string;
}) => {
  const methodName =
    `${field}`.replace(/\s+/g, "").charAt(0).toLowerCase() +
    `${field}`.replace(/\s+/g, "").slice(1);
  return (
    <div>
      <label
        htmlFor="lastName"
        className="block text-sm sm:text-base font-medium text-text-primary capitalize"
      >
        {field}
      </label>
      <div className="mt-1 relative">
        <div className="">
          {giftForm.formState.errors?.[methodName]?.message && (
            <span className="text-red-500 text-xs absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic w-1/2">
              {giftForm.formState.errors?.[methodName].message}
            </span>
          )}
        </div>
        {methodName === "state" ? (
          <select
            {...giftForm.register(methodName)}
            id="guest-region"
            autoComplete="address-level1"
            className="mt-1 focus:ring-text-primary text-text-primary focus:border-text-primary block w-full border sm:text-sm border-text-secondary rounded-md p-1 py-1.5 overflow-y-scroll"
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
        ) : (
          <input
            type="text"
            disabled={methodName === "country"}
            id={field}
            autoComplete="given-name"
            {...giftForm.register(methodName)}
            className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-base p-1 appearance-none "
            onChange={(e) => giftForm.clearErrors(methodName)}
          />
        )}
      </div>
    </div>
  );
};

export default FormField;
