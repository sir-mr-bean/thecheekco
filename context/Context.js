import { createContext, useContext, useReducer, useEffect } from "react";
import { cartReducer, productReducer, initializer } from "../context/Reducer";

const Cart = createContext();

const Context = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], initializer);

  useEffect(() => {
    localStorage.setItem("localCart", JSON.stringify(cart));
  }, [cart]);

  return <Cart.Provider value={{ cart, dispatch }}>{children}</Cart.Provider>;
};

export const CartState = () => {
  return useContext(Cart);
};

export default Context;
