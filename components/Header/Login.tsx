/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsChevronDown, BsPerson } from "react-icons/bs";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { signOut, useSession } from "next-auth/react";

function classNames(...classes: [string, string?, string?, Boolean?]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  const router = useRouter();
  const session = useSession();
  const currentUser = session?.data?.user;

  const handleSignOut = async () => {
    await signOut();
    router.reload();
  };

  return (
    <Menu
      as="div"
      className="relative inline-block items-center justify-center"
    >
      <div className="">
        <Menu.Button className="inline-flex w-full justify-center rounded-md py-2 font-gothic font-medium shadow-sm">
          <div className="hidden items-center whitespace-nowrap sm:flex sm:pr-10">
            My Account
            <BsChevronDown
              className="-mr-1 ml-2 h-4 w-4 bg-transparent"
              aria-hidden="true"
            />
          </div>

          {/* <div className="active:bg-black rounded-md active:bg-opacity-10 py-1.5 px-1.5 sm:hidden">
            <BsPerson size={21} className="fill-text-primary" />
          </div> */}
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
        <Menu.Items className="absolute top-8 right-0 mt-2 w-56 origin-top-right rounded-md bg-bg-lighttan shadow-lg focus:outline-none">
          <div className="">
            {!currentUser ? (
              <>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <a
                      href="/login"
                      className={classNames(
                        active
                          ? "rounded-md bg-bg-tan text-text-primary"
                          : "text-text-primary",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Sign In
                    </a>
                  )}
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <a
                      href="/profile"
                      className={classNames(
                        active
                          ? "rounded-t-md bg-bg-tan text-text-primary"
                          : "text-text-primary",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      My Profile
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      onClick={() => signOut()}
                      className={classNames(
                        active
                          ? "rounded-b-md bg-bg-tan text-text-primary"
                          : "text-text-primary",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
