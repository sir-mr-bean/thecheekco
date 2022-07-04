import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

const CheekyBoxForm = ({ giftForm }: { giftForm: UseFormReturn<any> }) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-3 sm:gap-y-6 sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-4">
      <div className="col-span-1">
        <FormField giftForm={giftForm} field="First Name" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={giftForm} field="Last Name" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={giftForm} field="Email" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={giftForm} field="Company" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={giftForm} field="Phone Number" />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <FormField giftForm={giftForm} field="Address" />
      </div>
      <FormField giftForm={giftForm} field="City" />
      <FormField giftForm={giftForm} field="State" />
      <FormField giftForm={giftForm} field="Post Code" />
      <FormField giftForm={giftForm} field="Country" />
    </div>
  );
};

export default CheekyBoxForm;
