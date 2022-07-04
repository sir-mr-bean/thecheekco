import { UseFormReturn } from "react-hook-form";

const FormField = ({
  methods,
  field,
}: {
  methods: UseFormReturn<any>;
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
        <div>
          {methods.formState.errors?.[methodName]?.message && (
            <span className="text-red-500 text-xs sm:text-sm absolute -top-2 right-0 bg-white rounded-sm px-1 font-gothic">
              {methods.formState.errors?.[methodName].message}
            </span>
          )}
        </div>
        <input
          type="text"
          id={field}
          autoComplete="given-name"
          {...methods.register(methodName)}
          className="block w-full border-text-secondary rounded-md border focus:ring-text-primary focus:border-text-primary sm:text-base p-1 appearance-none"
          onChange={(e) => methods.clearErrors(methodName)}
        />
      </div>
    </div>
  );
};

export default FormField;
