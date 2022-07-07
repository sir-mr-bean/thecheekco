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
import Script from "next/script";
import { oneko, destroyOneko } from "public/oneko/oneko";

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

Profile.displayName = "Profile";

export default function Profile(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();
  const tabFromQuery = tabs.find((tab) => tab.name === router.query?.tab);
  const [openTab, setOpenTab] = useState(tabFromQuery?.index || 1);
  const customerQuery = trpc.useQuery(
    [
      "square-customer.search-customer",
      { email: session?.user.email as string },
    ],
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

  const productIDs = customerOrders
    ?.map(
      (order) =>
        order.lineItems?.map((item) => item.catalogObjectId as string) ?? []
    )
    .flat();

  const { data: orderProducts, status: orderProductsStatus } = trpc.useQuery(
    [
      "square-products.search-products-by-ids",
      { productIds: productIDs as string[] },
    ],
    {
      enabled: !!customerQuery.data,
    }
  );

  useEffect(() => {
    if (status === String("unauthenticated")) {
      router.push("/login");
    } else {
      oneko();
    }
    return () => {
      destroyOneko();
    };
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
        <Script
          src="../../../public/oneko/oneko.js"
          strategy="afterInteractive"
        />
      </Head>
      <div className=" min-h-screen">
        <div>
          {status === String("loading") ? (
            <div className="mx-auto flex h-screen w-full items-center justify-center  text-text-primary">
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
                      ? `mx-2 mt-5 mb-2 grid h-16 max-h-max select-none grid-cols-5 items-end justify-between gap-1 border-b border-b-text-secondary text-center font-gothic text-xs text-text-primary sm:mx-8 sm:text-lg md:mx-auto md:w-2/3 md:gap-3 lg:whitespace-nowrap`
                      : `mx-2 mt-5 mb-2 grid h-16 max-h-max select-none grid-cols-4 items-end justify-between gap-1 border-b border-b-text-secondary text-center font-gothic text-sm text-text-primary sm:mx-8 sm:text-lg md:mx-auto md:w-2/3 md:gap-3 lg:whitespace-nowrap`
                  }
                >
                  <div
                    onClick={() => {
                      setOpenTab(1);
                    }}
                    className={
                      openTab === 1
                        ? `w-full cursor-pointer select-none border-b-2 border-b-text-primary font-bold`
                        : `w-full cursor-pointer`
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
                        ? `w-full cursor-pointer select-none border-b-2 border-b-text-primary font-bold`
                        : ` w-full cursor-pointer`
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
                        ? `w-full cursor-pointer select-none border-b-2 border-b-text-primary font-bold`
                        : ` w-full cursor-pointer`
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
                        ? `w-full cursor-pointer select-none border-b-2 border-b-text-primary font-bold`
                        : ` w-full cursor-pointer`
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
                          ? `w-full cursor-pointer select-none border-b-2 border-b-text-primary font-bold`
                          : ` w-full cursor-pointer`
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
                {openTab === 2 && session && (
                  <>
                    <UserInfo session={session} />
                  </>
                )}
                {openTab === 3 && customerOrders && (
                  <>
                    <UserOrders
                      customerOrders={customerOrders}
                      orderQueryStatus={orderQueryStatus}
                    />
                  </>
                )}
                {openTab === 4 && session && (
                  <>
                    <PaymentMethods userObj={session?.user} />
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
