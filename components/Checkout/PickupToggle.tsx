import { Switch } from "@headlessui/react";
import { FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PickupToggle = ({ pickup, setPickup }) => {
  return (
    <div className="grid grid-cols-3 items-center justify-center gap-1 w-fit whitespace-nowrap">
      <span className={pickup === true ? `sm:text-xl` : `font-bold sm:text-xl`}>
        Delivery
      </span>
      <Switch
        checked={pickup}
        onChange={setPickup}
        className={classNames(
          pickup ? "bg-text-primary" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-11 w-[110px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
        )}
      >
        <span className="sr-only">Delivery or Click and Collect</span>
        <span
          className={classNames(
            pickup ? "translate-x-16" : "translate-x-0",
            "pointer-events-none relative inline-block h-10 w-10 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        >
          <span
            className={classNames(
              pickup
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <FaShippingFast />
          </span>
          <span
            className={classNames(
              pickup
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <HiCursorClick />
          </span>
        </span>
      </Switch>
      <span className={pickup === true ? `font-bold sm:text-xl` : `sm:text-xl`}>
        Click and Collect
      </span>
    </div>
  );
};

export default PickupToggle;
