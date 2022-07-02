import { CartObject } from "@/types/CartObject";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer, cartInitializer } from "./Reducer";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

interface CartContext {
  cart: CartObject[];
  dispatch: (action: any) => void;
}

const Cart = createContext<CartContext>({
  cart: [],
  dispatch: () => {},
});

const CartContext = ({ children }: { children: React.ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], cartInitializer);

  useEffect(() => {
    if (window !== undefined) {
      localStorage.setItem("localCart", JSON.stringify(cart));
    }
  }, [cart]);

  return <Cart.Provider value={{ cart, dispatch }}>{children}</Cart.Provider>;
};

export const CartState = () => {
  return useContext(Cart);
};

export default CartContext;
