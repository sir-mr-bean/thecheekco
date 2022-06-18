import { useEffect, useState, useContext, forwardRef, Fragment } from "react";
import { useRouter } from "next/router";
import UserInfo from "../../../components/Profile/UserInfo";
import UserOrders from "../../../components/Profile/UserOrders";
import UserDashboard from "../../../components/Profile/UserDashboard";
import { useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { User } from "@prisma/client";
import { NextPage } from "next";

const tabs = [
  {
    index: 1,
    name: "dashboard",
  },
  {
    index: 2,
    name: "account",
  },
  {
    index: 3,
    name: "orders",
  },
  {
    index: 4,
    name: "payment",
  },
];
Profile.auth = {};
export default function Profile(): JSX.Element {
  const { data: session, status } = useSession();
  console.log();
  console.log("session is ", session);
  const router = useRouter();
  const tabFromQuery = tabs.find((tab) => tab.name === router.query?.tab);
  const [openTab, setOpenTab] = useState(tabFromQuery?.index || 1);

  console.log(status);
  // useEffect(() => {
  //   if (status === String("unauthenticated")) {
  //     router.push("/login");
  //   }
  // }, [status]);

  return (
    <>
      {status && (
        <div>
          {status === String("loading") ? (
            <div className="flex h-screen w-full justify-center items-center mx-auto  text-text-primary">
              <BeatLoader
                color="#602d0d"
                loading={status === String("loading")}
                size={20}
              />
            </div>
          ) : (
            status === String("authenticated") && (
              <div>
                <div className="max-h-max grid grid-cols-4 items-end border-b border-b-text-secondary text-text-primary font-gothic text-sm sm:text-lg mx-2 sm:mx-8 mt-5 mb-2 justify-between text-center h-11 md:h-16 md:w-2/3 md:mx-auto lg:whitespace-nowrap gap-1 md:gap-3">
                  <div
                    onClick={() => {
                      setOpenTab(1);
                    }}
                    className={
                      openTab === 1
                        ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none no-underline:`
                        : ` border-b-text-primary cursor-pointer w-full`
                    }
                  >
                    <span
                      className={openTab === 1 ? `font-bold` : `font-normal`}
                    >
                      Dashboard
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setOpenTab(2);
                    }}
                    className={
                      openTab === 2
                        ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none no-underline:`
                        : ` border-b-text-primary cursor-pointer w-full`
                    }
                  >
                    <span
                      className={openTab === 2 ? `font-bold` : `font-normal`}
                    >
                      Account Details
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setOpenTab(3);
                    }}
                    className={
                      openTab === 3
                        ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none no-underline:`
                        : ` border-b-text-primary cursor-pointer w-full`
                    }
                  >
                    <span
                      className={openTab === 3 ? `font-bold` : `font-normal`}
                    >
                      Orders
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setOpenTab(4);
                    }}
                    className={
                      openTab === 4
                        ? `font-bold border-2 border-x-0 border-t-0 border-b-text-primary cursor-pointer w-full select-none no-underline:`
                        : ` border-b-text-primary cursor-pointer w-full`
                    }
                  >
                    <span
                      className={openTab === 4 ? `font-bold` : `font-normal`}
                    >
                      Payment Methods
                    </span>
                  </div>
                </div>
                {openTab === 1 && (
                  <>
                    <UserDashboard />
                  </>
                )}
                {openTab === 2 && (
                  <>
                    <UserInfo session={session} />
                  </>
                )}
                {openTab === 3 && (
                  <>
                    <UserOrders />
                  </>
                )}
                {openTab === 4 && (
                  <>
                    <UserInfo session={session} />
                  </>
                )}
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}
