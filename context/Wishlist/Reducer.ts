import { WishlistObject } from "@/types/WishlistObject";
import { CatalogObject } from "square";

const initialWishList: WishlistObject[] = [];

enum WishlistActionKind {
  ADD_TO_WISHLIST = "ADD_TO_WISHLIST",
  REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST",
  CLEAR_WISHLIST = "CLEAR_WISHLIST",
}

// An interface for our actions
interface WishlistAction {
  type: WishlistActionKind;
  item: WishlistObject;
}

interface CountState {
  product: CatalogObject;
  productImage?: string;
}

export const wishListInitializer = (initialValue = initialWishList) => {
  if (typeof window !== "undefined") {
    const localWishList = localStorage.getItem("wishlist");
    if (localWishList) {
      return JSON.parse(localStorage.getItem("wishlist") as string);
    } else {
      return initialValue;
    }
  }
};

export const wishListReducer = (
  state: CountState[] = wishListInitializer(),
  action: WishlistAction
) => {
  switch (action.type) {
    case WishlistActionKind.ADD_TO_WISHLIST:
      if (state.find((item) => item?.product?.id === action.item.product.id)) {
        return state;
      }
      return [...state, action.item];
    case WishlistActionKind.REMOVE_FROM_WISHLIST:
      return state.filter((item) => {
        return item?.product?.id != action.item.product.id;
      });
    case WishlistActionKind.CLEAR_WISHLIST:
      return [];
    default:
      return state;
  }
};

export const addToWishList = (item: WishlistObject) => ({
  type: WishlistActionKind.ADD_TO_WISHLIST,
  payload: item,
});

export const removeFromWishList = (item: WishlistObject) => ({
  type: "REMOVE_FROM_WISHLIST",
  payload: item,
});

export const clearWishList = () => ({
  type: "CLEAR_WISHLIST",
});
