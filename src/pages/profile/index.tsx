import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserInfo from "@/components/Profile/UserInfo";
import UserOrders from "@/components/Profile/UserOrders";
import UserDashboard from "@/components/Profile/UserDashboard";
import Admin from "@/components/Profile/Admin";
import PaymentMethods from "@/components/Profile/PaymentMethods";
import { useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

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
  {
    index: 5,
    name: "admin",
  },
];

export default function Profile(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const tabFromQuery = tabs.find((tab) => tab.name === router.query?.tab);
  const [openTab, setOpenTab] = useState(tabFromQuery?.index || 1);
  const customerQuery = trpc.useQuery(
    ["search-customer", { email: session?.user.email as string }],
    {
      enabled: !!session,
    }
  );
  const { data: customerOrders, status: orderQueryStatus } = trpc.useQuery(
    [
      "square-order.get-order-ids",
      { customerId: customerQuery?.data?.id as string },
    ],
    {
      enabled: !!customerQuery.data,
    }
  );

  useEffect(() => {
    if (status === String("unauthenticated")) {
      router.push("/login");
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>The Cheek Co. - My Account</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" min-h-screen">
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
                <div
                  className={
                    session?.user?.isAdmin
                      ? `select-none max-h-max grid grid-cols-5 items-end border-b border-b-text-secondary text-text-primary font-gothic text-xs sm:text-lg mx-2 sm:mx-8 mt-5 mb-2 justify-between text-center h-16 md:w-2/3 md:mx-auto lg:whitespace-nowrap gap-1 md:gap-3`
                      : `select-none max-h-max grid grid-cols-4 items-end border-b border-b-text-secondary text-text-primary font-gothic text-sm sm:text-lg mx-2 sm:mx-8 mt-5 mb-2 justify-between text-center h-16 md:w-2/3 md:mx-auto lg:whitespace-nowrap gap-1 md:gap-3`
                  }
                >
                  <div
                    onClick={() => {
                      setOpenTab(1);
                    }}
                    className={
                      openTab === 1
                        ? `font-bold border-b-2 border-b-text-primary cursor-pointer w-full select-none`
                        : `cursor-pointer w-full`
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
                        ? `font-bold border-b-2 border-b-text-primary cursor-pointer w-full select-none`
                        : ` cursor-pointer w-full`
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
                        ? `font-bold border-b-2 border-b-text-primary cursor-pointer w-full select-none`
                        : ` cursor-pointer w-full`
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
                        ? `font-bold border-b-2 border-b-text-primary cursor-pointer w-full select-none`
                        : ` cursor-pointer w-full`
                    }
                  >
                    <span
                      className={openTab === 4 ? `font-bold` : `font-normal`}
                    >
                      Payment Methods
                    </span>
                  </div>
                  {session?.user?.isAdmin && (
                    <div
                      onClick={() => {
                        setOpenTab(5);
                      }}
                      className={
                        openTab === 5
                          ? `font-bold border-b-2 border-b-text-primary cursor-pointer w-full select-none`
                          : ` cursor-pointer w-full`
                      }
                    >
                      <span
                        className={openTab === 4 ? `font-bold` : `font-normal`}
                      >
                        Admin
                      </span>
                    </div>
                  )}
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
                    <UserOrders
                      customerOrders={customerOrders}
                      orderQueryStatus={orderQueryStatus}
                    />
                  </>
                )}
                {openTab === 4 && (
                  <>
                    <PaymentMethods />
                  </>
                )}
                {openTab === 5 && (
                  <>
                    <Admin />
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
