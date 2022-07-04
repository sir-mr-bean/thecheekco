import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";

const GifterForm = ({ gifterForm }: { gifterForm: UseFormReturn<any> }) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-3 sm:gap-y-6 sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-4">
      <div className="col-span-1">
        <FormField giftForm={gifterForm} field="First Name" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={gifterForm} field="Last Name" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={gifterForm} field="Email" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={gifterForm} field="Company" />
      </div>
      <div className="col-span-1">
        <FormField giftForm={gifterForm} field="Phone Number" />
      </div>
    </div>
  );
};

export default GifterForm;
