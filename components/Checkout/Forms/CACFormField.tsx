import { UseFormReturn } from "react-hook-form";

const CACFormField = ({
  form,
  field,
  defaultValue,
}: {
  form: UseFormReturn<any>;
  field: string;
  defaultValue: string | null;
}) => {
  const methodName =
    `${field}`.replace(/\s+/g, "").charAt(0).toLowerCase() +
    `${field}`.replace(/\s+/g, "").slice(1);

  return (
    <>
      <div className="">
        {methodName === "termsAccepted" ? (
          <div className="flex flex-col space-x-2 space-y-2">
            <div className="flex items-center space-x-2 ">
              <input
                id={methodName}
                {...form.register(methodName, { required: true })}
                type="checkbox"
                onChange={(e) => form.clearErrors(methodName)}
                className="h-6 w-6 rounded border-text-secondary text-text-secondary accent-text-secondary focus:ring-text-secondary"
              />
              <label
                htmlFor={`${methodName}`}
                className="select-none text-sm text-text-primary"
              >
                I have read the terms and conditions and privacy policy.
              </label>
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor={`${methodName}`}
              className="block text-sm font-medium text-text-primary"
            >
              {field}
            </label>
            <div className="mt-1">
              <input
                type="text"
                id={methodName}
                key={methodName}
                {...form.register(methodName)}
                onChange={(e) => form.clearErrors(methodName)}
                defaultValue={defaultValue || ""}
                className="block w-full appearance-none rounded-md border border-text-secondary p-1 focus:border-text-primary focus:ring-text-primary sm:text-sm"
              />
            </div>
          </>
        )}
        {form.formState.errors?.[methodName]?.message &&
        form.formState.errors?.[methodName]?.type !== "invalid_literal" ? (
          <span className=" z-20 whitespace-nowrap rounded-xl bg-white px-2 py-1 text-center font-gothic text-xs text-red-500">
            {form.formState.errors?.[methodName].message}
          </span>
        ) : (
          form.formState.errors?.[methodName]?.message &&
          form.formState.errors?.[methodName]?.type === "invalid_literal" && (
            <span className=" z-20 whitespace-nowrap rounded-xl bg-white px-2 py-1 text-center font-gothic text-xs text-red-500">
              You must accept the terms and conditions & privacy policy to
              continue.
            </span>
          )
        )}
      </div>
    </>
  );
};

export default CACFormField;
