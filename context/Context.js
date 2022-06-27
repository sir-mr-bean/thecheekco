import { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer, cartInitializer } from "./Reducer";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const Cart = createContext();

const CartContext = ({ children }) => {
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
