import { WishlistState } from "@/context/Wishlist/Context";
import { CartState } from "@/context/Cart/Context";
import { WishlistObject } from "@/types/WishlistObject";
import Wishlist from "./Dashboard/Wishlist";
import Link from "next/link";
import { Order } from "square";

const UserDashboard = ({
  customerOrders,
  orderQueryStatus,
}: {
  customerOrders: Order[] | undefined;
  orderQueryStatus: string;
}) => {
  const { wishlist, dispatch } = WishlistState();
  const { cart, dispatch: dispatchCart } = CartState();

  return (
    <div className="flex flex-col space-y-2">
      <div className="m-2 rounded-md bg-white font-gothic shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-3">
        <div className="mx-auto max-w-4xl py-3 sm:px-6 sm:py-4">
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
      <div className="m-2 rounded-md bg-white px-4 py-5 font-gothic text-text-primary shadow sm:m-6 sm:mx-auto sm:w-3/4 sm:rounded-lg sm:p-6">
        {wishlist.length > 0 ? (
          <>
            <span>My Wishlist</span>
            <Wishlist />
            {wishlist.length > 5 && (
              <div className="text-center">
                <Link href="/wishlist">
                  <a>
                    <span className="text-text-primary">View All</span>
                  </a>
                </Link>
              </div>
            )}
          </>
        ) : (
          <span>
            No items in your wishlist.. Find your next favourite goodie{" "}
            <a href="/shop">
              {" "}
              <span className="underline decoration-text-secondary decoration-dotted underline-offset-2">
                now
              </span>
            </a>
          </span>
        )}
        {wishlist.length > 0 ? (
          <>
            <span>My Recent Orders</span>
            <Wishlist />
          </>
        ) : (
          <span>
            No items in your wishlist.. Find your next favourite goodie{" "}
            <a href="/shop">
              {" "}
              <span className="underline decoration-text-secondary decoration-dotted underline-offset-2">
                now
              </span>
            </a>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
