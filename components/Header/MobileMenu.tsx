/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { Category } from "@/types/Category";
import { CatalogObject } from "square";

function classNames(...classes: [string, string?, string?, Boolean?]): string {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMenu({
  navigation,
}: {
  navigation: CatalogObject[];
}): JSX.Element {
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
          <div className="">
            <>
              <div className="divide divide-text-primary divide-y">
                <ul>
                  {navigation &&
                    navigation?.length > 0 &&
                    navigation
                      .sort((a: CatalogObject, b: CatalogObject) =>
                        a.id > b.id ? 1 : -1
                      )
                      .filter(
                        (item: CatalogObject) =>
                          item?.categoryData?.name?.charAt(0) != "_"
                      )
                      ?.map((nav: CatalogObject, i: number) => {
                        return (
                          <li key={i}>
                            <Menu.Item as="div">
                              {({ active }: any) => (
                                <Link
                                  key={nav.id}
                                  href="/shop/[id]/"
                                  as={`/shop/${nav.categoryData?.name
                                    ?.toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                >
                                  <div
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-text-secondary"
                                        : "text-text-primary",
                                      i === 0 ? "rounded-t-md" : "",
                                      "block px-4 py-2 text-sm hover:bg-bg-tan cursor-pointer"
                                    )}
                                  >
                                    {nav.categoryData?.name}
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          </li>
                        );
                      })}
                </ul>
                <div>
                  <Menu.Item>
                    {({ active }: any) => (
                      <Link href="/eco-innovation/">
                        <div
                          className={classNames(
                            active
                              ? "bg-gray-100 text-text-secondary"
                              : "text-text-primary",
                            "block px-4 py-2 text-sm hover:bg-bg-tan cursor-pointer"
                          )}
                        >
                          Eco Innovation
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: any) => (
                      <Link href="/wishlist/">
                        <div
                          className={classNames(
                            active
                              ? "bg-gray-100 text-text-secondary rounded-b-md"
                              : "text-text-primary",
                            "block px-4 py-2 text-sm hover:bg-bg-tan cursor-pointer rounded-b-md"
                          )}
                        >
                          My Wishlist
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </div>
            </>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
