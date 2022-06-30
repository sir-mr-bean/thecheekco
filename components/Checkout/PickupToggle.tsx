import { Switch } from "@headlessui/react";
import { FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PickupToggle = ({ pickup, setPickup }) => {
  return (
    <div className="w-full relative my-5">
      <div className="flex items-center justify-between w-full mx-auto ">
        <span
          className={pickup === true ? `lg:text-lg` : `font-bold lg:text-lg`}
        >
          Delivery
        </span>
        <div className="w-full"></div>
        <div className="absolute top-1/2 left-2/4 transform -translate-x-1/2 -translate-y-1/2">
          <Switch
            checked={pickup}
            onChange={setPickup}
            className={classNames(
              pickup ? "" : "",
              "relative bg-gray-200 inline-flex h-7 lg:h-11 w-16 lg:w-[110px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 "
            )}
          >
            <span className="sr-only">Delivery or Click and Collect</span>
            <span
              className={classNames(
                pickup
                  ? "translate-x-9 lg:translate-x-[66px]"
                  : "translate-x-0",
                "pointer-events-none relative inline-block h-6 w-6 lg:h-10 lg:w-10 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
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
          className={
            pickup === true
              ? `font-bold lg:text-lg text-center`
              : `lg:text-lg text-center`
          }
        >
          Click and Collect
        </span>
      </div>
    </div>
  );
};

export default PickupToggle;
