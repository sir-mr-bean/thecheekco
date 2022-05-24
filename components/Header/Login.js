/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsChevronDown, BsPerson } from "react-icons/bs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  return (
    <Menu
      as="div"
      className="relative inline-block justify-center items-center"
    >
      <div className="">
        <Menu.Button className="inline-flex justify-center w-full rounded-md shadow-sm py-2 font-medium font-gothic">
          <div className="hidden sm:flex">
            Login
            <BsChevronDown
              className="-mr-1 ml-2 h-4 w-4 bg-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="active:bg-black rounded-md active:bg-opacity-10 py-1.5 px-1.5 sm:hidden">
            <BsPerson size={21} className="fill-text-primary" />
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute top-8 right-0 mt-2 w-56 rounded-md shadow-lg bg-bg-lighttan focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/login"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-text-secondary"
                      : "text-text-primary",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My Account
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/register"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-text-secondary"
                      : "text-text-primary",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Join
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
