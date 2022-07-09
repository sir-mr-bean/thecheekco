/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { Category } from "@/types/Category";
import { CatalogObject } from "square";
import { trpc } from "@/utils/trpc";
import { signOut, useSession } from "next-auth/react";

function classNames(...classes: [string, string?, string?, Boolean?]): string {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMenu(): JSX.Element {
  const categoryQuery = trpc.useQuery(["square-categories.all-categories"]);
  const { data: navigation } = categoryQuery;
  const session = useSession();
  return (
    <Menu
      as="div"
      className="relative inline-block items-center justify-center"
    >
      <div className="">
        <Menu.Button className="inline-flex w-full justify-center rounded-md py-2 font-gothic font-medium shadow-sm">
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
        <Menu.Items className="absolute top-8 right-0 mt-2 w-32 origin-top-right rounded-md bg-bg-lighttan shadow-lg focus:outline-none">
          <div className="">
            <>
              <div className="divide divide-y divide-text-primary">
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
                                  passHref
                                  href="/shop/[id]/"
                                  as={`/shop/${nav.categoryData?.name
                                    ?.toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                >
                                  <a href="/shop/[id]/">
                                    <div
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-text-secondary"
                                          : "text-text-primary",
                                        i === 0 ? "rounded-t-md" : "",
                                        "block cursor-pointer px-4 py-2 text-sm hover:bg-bg-tan"
                                      )}
                                    >
                                      {nav.categoryData?.name}
                                    </div>
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                          </li>
                        );
                      })}
                </ul>
                <div>
                  {session.status === "unauthenticated" ? (
                    <Menu.Item as="div">
                      <Link passHref href="/login/">
                        <a href="/login">
                          <div className="block cursor-pointer rounded-b-md px-4 py-2 text-sm text-text-primary hover:bg-bg-tan ui-active:rounded-b-md ui-active:bg-gray-100 ui-active:text-text-secondary">
                            Login
                          </div>
                        </a>
                      </Link>
                    </Menu.Item>
                  ) : (
                    <div className="w-full">
                      <Menu.Item as="div">
                        <Link passHref href="/profile">
                          <a href="/profile">
                            <div className="block cursor-pointer rounded-b-md px-4 py-2 text-sm text-text-primary hover:bg-bg-tan ui-active:rounded-b-md ui-active:bg-gray-100 ui-active:text-text-secondary">
                              My Profile
                            </div>
                          </a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item as="div">
                        <Link passHref href="/profile">
                          <a href="/profile">
                            <button
                              onClick={() => signOut()}
                              className="block w-full cursor-pointer rounded-b-md px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-tan ui-active:rounded-b-md ui-active:bg-gray-100 ui-active:text-text-secondary"
                            >
                              Sign Out
                            </button>
                          </a>
                        </Link>
                      </Menu.Item>
                    </div>
                  )}
                </div>
                <div>
                  <Menu.Item as="div">
                    <Link passHref href="/wishlist/">
                      <a href="/wishlist/">
                        <div className="block cursor-pointer rounded-b-md px-4 py-2 text-sm text-text-primary hover:bg-bg-tan ui-active:rounded-b-md ui-active:bg-gray-100 ui-active:text-text-secondary">
                          My Wishlist
                        </div>
                      </a>
                    </Link>
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
