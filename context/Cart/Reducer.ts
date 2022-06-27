// Shopping Cart Reducer

import { CartObject } from "@/types/CartObject";

// Initial Cart State

const initialCart: CartObject[] = [];

export const cartInitializer = (initialValue = initialCart) => {
  if (typeof window !== "undefined") {
    const localCart = localStorage.getItem("localCart");
    if (localCart) {
      return JSON.parse(localStorage.getItem("localCart") as string);
    } else {
      return initialValue;
    }
  }
};

// Cart Reducer

export enum CartActionKind {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  CLEAR_CART = "CLEAR_CART",
  SET_QUANTITY = "SET_QUANTITY",
  null = "null",
}

interface CartAction {
  type: CartActionKind;
  item: CartObject;
  quantity?: string;
  productImage?: string;
}

export const cartReducer = (state: CartObject[], action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.id === action.item.id
              ? {
                  ...item,
                  quantity: item.quantity + parseInt(action.quantity as string),
                }
              : { ...item, quantity: 1 }
          )
        : [
            ...state,
            { ...action.item, productImage: action?.productImage, quantity: 1 },
          ];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.item.id);
    case "SET_QUANTITY":
      // if quantity is 1 remove from cart, otherwise decrement quantity
      const result = state.map(
        (item) => item.itemData?.name === action.item.itemData?.name
      );
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.itemData?.name === action.item.itemData?.name
              ? {
                  ...item,
                  quantity: parseInt(action.quantity as string),
                }
              : item
          )
        : state;

    case "CLEAR_CART":
      return initialCart;

    default:
      return state;
  }
};

// Reducer Functions

export const addToCart = (item: CartObject) => ({
  type: "ADD_TO_CART",
  item,
});

export const decrementItemQuantity = (item: CartObject) => ({
  type: "DECREMENT_QUANTITY",
  item,
});

export const removeFromCart = (item: CartObject) => ({
  type: "REMOVE_FROM_CART",
  item,
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});
