import { createContext, useContext, useReducer, useEffect } from "react";
import {
  cartReducer,
  cartInitializer,
  wishListReducer,
  wishListInitializer,
} from "./Reducer";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const Cart = createContext();
const WishList = createContext();

const CartContext = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], cartInitializer);

  useEffect(() => {
    if (window !== undefined) {
      localStorage.setItem("localCart", JSON.stringify(cart));
    }
  }, [cart]);

  return <Cart.Provider value={{ cart, dispatch }}>{children}</Cart.Provider>;
};

export const WishListContext = ({ children }) => {
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
    <WishList.Provider value={{ wishlist, dispatch }}>
      {children}
    </WishList.Provider>
  );
};

export const WishlistState = () => {
  return useContext(WishList);
};

export const CartState = () => {
  return useContext(Cart);
};

export default CartContext;
