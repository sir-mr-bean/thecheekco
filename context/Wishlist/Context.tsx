import { WishlistObject } from "@/types/WishlistObject";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  PropsWithChildren,
} from "react";
import { CatalogObject } from "square";
import {
  wishListReducer,
  wishListInitializer,
  addToWishList,
  clearWishList,
  removeFromWishList,
} from "./Reducer";

interface WishlistContext {
  wishlist: WishlistObject[];
  dispatch: (action: any) => void;
}

const WishList = createContext<WishlistContext>({
  wishlist: [],
  dispatch: () => {},
});

const WishListContext = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, dispatch] = useReducer(
    wishListReducer,
    [],
    wishListInitializer
  );

  useEffect(() => {
    if (window !== undefined) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  return (
    <WishList.Provider
      value={{
        wishlist,
        dispatch,
      }}
    >
      {children}
    </WishList.Provider>
  );
};

export const WishlistState = () => useContext(WishList);

export default WishListContext;
