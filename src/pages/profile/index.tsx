import { useEffect, useState, useContext, forwardRef, Fragment } from "react";
import { useRouter } from "next/router";
import UserInfo from "../../../components/Profile/UserInfo";
import UserOrders from "../../../components/Profile/UserOrders";
import UserDashboard from "../../../components/Profile/UserDashboard";
import { getSession, useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { Customer, Order } from "square";
import { Session } from "next-auth";

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
// Profile.auth = {
//   isAuthenticated: async (session: Session) => {
//     console.log(session);
//     if (session) {
//       return true;
//     }
//     return false;
//   },
// };
export default function Profile(): JSX.Element {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log(session);
  const router = useRouter();
  const tabFromQuery = tabs.find((tab) => tab.name === router.query?.tab);
  const [openTab, setOpenTab] = useState(tabFromQuery?.index || 1);
  const queryContext = trpc.useContext();
  const customerQuery = trpc.useQuery(
    ["searchCustomer", { email: session?.user.email as string }],
    {
      // The query will not execute until the userId exists
      enabled: !!user,
    }
  );
  console.log(customerQuery);
  const currentCustomer = customerQuery.data;
  const orderQuery = trpc.useQuery(
    ["getOrders", { customerId: customerQuery?.data?.id as string }],
    {
      // The query will not execute until the userId exists
      enabled: !!currentCustomer,
    }
  );
  console.log(orderQuery);
  const customerOrders = orderQuery.data;
  console.log(customerOrders);

  useEffect(() => {
    if (status === String("unauthenticated")) {
      router.push("/login");
    }
  }, [session]);

  return (
    <>
      {session && (
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
                    <UserOrders customerOrders={customerOrders} />
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

import { GetServerSideProps } from "next";
