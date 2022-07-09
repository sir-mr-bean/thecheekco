import { IntroOptions } from "@/types/PageOptions";
import GiftOption from "./GiftOption";
import RecurringOption from "./RecurringOption";

const CheckoutResults = ({ introOptions }: { introOptions: IntroOptions }) => {
  return (
    <>
      {introOptions.duration === "monthly" ? (
        <RecurringOption />
      ) : (
        <GiftOption />
      )}
    </>
  );
};

export default CheckoutResults;
