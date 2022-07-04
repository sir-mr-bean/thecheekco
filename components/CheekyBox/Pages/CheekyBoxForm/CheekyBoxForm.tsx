import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

const CheekyBoxForm = ({ methods }: { methods: UseFormReturn<any> }) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
      <div className="col-span-2">
        <FormField methods={methods} field="First Name" />
      </div>
      <div className="col-span-2">
        <FormField methods={methods} field="Last Name" />
      </div>
      <div className="col-span-2">
        <FormField methods={methods} field="Email" />
      </div>
      <div className="col-span-2">
        <FormField methods={methods} field="Company" />
      </div>
      <div className="col-span-2">
        <FormField methods={methods} field="Phone Number" />
      </div>
      <div className="col-span-3">
        <FormField methods={methods} field="Address" />
      </div>
      <FormField methods={methods} field="City" />
      <FormField methods={methods} field="State" />
      <FormField methods={methods} field="Post Code" />
      <FormField methods={methods} field="Country" />
    </div>
  );
};

export default CheekyBoxForm;
