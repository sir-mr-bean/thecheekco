import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

const CheekyBoxForm = ({ giftForm }: { giftForm: UseFormReturn<any> }) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-y-6 sm:gap-x-4 xl:grid-cols-4">
      <div className="col-span-1">
        <FormField form={giftForm} field="First Name" />
      </div>
      <div className="col-span-1">
        <FormField form={giftForm} field="Last Name" />
      </div>
      <div className="col-span-1">
        <FormField form={giftForm} field="Email" />
      </div>
      <div className="col-span-1">
        <FormField form={giftForm} field="Company" />
      </div>
      <div className="col-span-1">
        <FormField form={giftForm} field="Phone Number" />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <FormField form={giftForm} field="Address" />
      </div>
      <FormField form={giftForm} field="City" />
      <FormField form={giftForm} field="State" />
      <FormField form={giftForm} field="Post Code" />
      <FormField form={giftForm} field="Country" />
    </div>
  );
};

export default CheekyBoxForm;
