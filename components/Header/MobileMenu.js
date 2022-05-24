/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMenu({ navigation }) {
  return (
    <Menu
      as="div"
      className="relative inline-block justify-center items-center"
    >
      <div className="">
        <Menu.Button className="inline-flex justify-center w-full rounded-md shadow-sm py-2 font-medium font-gothic">
          <div className="flex sm:hidden">
            <GiHamburgerMenu size={21} className="fill-text-primary" />
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
        <Menu.Items className="origin-top-right absolute top-8 right-0 mt-2 w-32 rounded-md shadow-lg bg-bg-lighttan focus:outline-none">
          <div className="py-1">
            <>
              {navigation
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .map((nav) => {
                  console.log(nav);
                  return (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          key={nav.id}
                          href="/shop/[id]/"
                          as={`/shop/${nav.attributes.name}`}
                        >
                          <div
                            className={classNames(
                              active
                                ? "bg-gray-100 text-text-secondary"
                                : "text-text-primary",
                              "block px-4 py-2 text-sm hover:bg-bg-tan cursor-pointer"
                            )}
                          >
                            {nav.attributes.displayname}
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  );
                })}
            </>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
