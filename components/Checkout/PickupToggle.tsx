import { Switch } from "@headlessui/react";
import { FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PickupToggle = ({ pickup, setPickup }) => {
  return (
    <div className="w-full relative my-5">
      <div className="flex items-center justify-between gap-1 w-full whitespace-nowrap mx-auto">
        <span
          className={pickup === true ? `sm:text-xl` : `font-bold sm:text-xl`}
        >
          Delivery
        </span>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Switch
            checked={pickup}
            onChange={setPickup}
            className={classNames(
              pickup ? "" : "",
              "relative bg-gray-200 inline-flex h-7 sm:h-11 w-16 sm:w-[110px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 "
            )}
          >
            <span className="sr-only">Delivery or Click and Collect</span>
            <span
              className={classNames(
                pickup
                  ? "translate-x-9 sm:translate-x-[66px]"
                  : "translate-x-0",
                "pointer-events-none relative inline-block h-6 w-6 sm:h-10 sm:w-10 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
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
        </div>
        <span
          className={pickup === true ? `font-bold sm:text-xl` : `sm:text-xl`}
        >
          Click and Collect
        </span>
      </div>
    </div>
  );
};

export default PickupToggle;
