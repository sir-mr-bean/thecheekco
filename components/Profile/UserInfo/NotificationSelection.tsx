import { UseFormReturn } from "react-hook-form";
import NotificationOption from "./NotificationOption";

const NotificationSelection = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <div className="flex w-full flex-col items-start justify-center space-y-4">
      <NotificationOption
        form={form}
        field="Essential Notifications"
        description="Recieve essential notifications by email (Order Information etc)."
      />
      <NotificationOption
        form={form}
        field="Newsletters"
        description="Recieve the scheduled newsletters by email."
      />
      <NotificationOption
        form={form}
        field="Promotions"
        description="Recieve promotions by email."
      />
    </div>
  );
};

export default NotificationSelection;
