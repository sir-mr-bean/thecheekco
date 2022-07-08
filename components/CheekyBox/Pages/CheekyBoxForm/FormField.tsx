import { UseFormReturn } from "react-hook-form";

const FormField = ({
  form,
  field,
}: {
  form: UseFormReturn<any>;
  field: string;
}) => {
  const methodName =
    `${field}`.replace(/\s+/g, "").charAt(0).toLowerCase() +
    `${field}`.replace(/\s+/g, "").slice(1);
  return (
    <div>
      <label
        htmlFor={`${field}`}
        className="block text-sm font-medium capitalize text-text-primary sm:text-base"
      >
        {field}
      </label>
      <div className="relative mt-1">
        {methodName === "state" ? (
          <select
            {...form.register(methodName)}
            id="guest-region"
            autoComplete="address-level1"
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
        ) : (
          <input
            type="text"
            disabled={methodName === "country"}
            id={field}
            autoComplete="given-name"
            {...form.register(methodName)}
            className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-base "
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
