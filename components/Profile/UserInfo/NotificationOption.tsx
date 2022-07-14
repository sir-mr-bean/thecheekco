import { UseFormReturn } from "react-hook-form";

const NotificationOption = ({
  form,
  field,
  description,
}: {
  form: UseFormReturn<any>;
  field: string;
  description: string;
}) => {
  const methodName =
    `${field}`.replace(/\s+/g, "").charAt(0).toLowerCase() +
    `${field}`.replace(/\s+/g, "").slice(1);
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          {...form.register(methodName)}
          id={field}
          type="checkbox"
          className="h-4 w-4 rounded border-text-secondary text-text-primary  focus:ring focus:ring-text-primary"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="comments" className="font-medium text-text-primary">
          {field}
        </label>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  );
};

export default NotificationOption;
