import { WishlistState } from "@/context/Wishlist/Context";
import { CartState } from "@/context/Cart/Context";
import { WishlistObject } from "@/types/WishlistObject";
import Wishlist from "./Dashboard/Wishlist";
import Link from "next/link";
import { Order } from "square";
import RecentOrders from "./Dashboard/RecentOrders";
import { BeatLoader } from "react-spinners";

const UserDashboard = ({
  customerOrders,
  orderQueryStatus,
  setOpenTab,
}: {
  customerOrders: Order[] | undefined;
  orderQueryStatus: string;
  setOpenTab: (tab: number) => void;
}) => {
  console.log(orderQueryStatus);
  return (
    <div className="flex flex-col space-y-2">
      <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
        <div className="max-w-4xl py-3 sm:px-6 sm:py-4">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Check your recent orders, wishlist and account details.
            </p>
          </div>
        </div>
      </div>
      <div className="m-2 flex flex-col items-stretch justify-center space-y-3  rounded-md bg-white px-4 py-5 font-gothic text-text-primary shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
        <Wishlist />

        {customerOrders && customerOrders.length > 0 ? (
          <>
            <RecentOrders
              setOpenTab={setOpenTab}
              customerOrders={customerOrders}
            />
          </>
        ) : orderQueryStatus === "loading" ? (
          <>
            <div className="mx-auto flex h-10 w-full items-center justify-center  text-text-primary">
              <BeatLoader
                color="#602d0d"
                loading={orderQueryStatus === String("loading")}
                size={8}
              />
            </div>
          </>
        ) : (
          orderQueryStatus === "success" &&
          customerOrders?.length === 0 && (
            <span>
              No recent orders. Find your next favourite goodie{" "}
              <a href="/shop">
                {" "}
                <span className="underline decoration-text-secondary decoration-dotted underline-offset-2">
                  now
                </span>
              </a>
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
