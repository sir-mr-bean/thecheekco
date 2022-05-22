import Header from "../Header/Header";
import { useState } from "react";

export default function Layout(props) {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  console.log(props);
  const navigation = props.navigation;
  const children = props.children;

  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
      const result = cartItems.forEach((item) => {
        let total = 0;
        console.log(item.qty);
        return total + item.qty;
      });
      console.log(result);
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
      const result = cartItems.forEach((item) => {
        let total = 0;
        console.log(item.qty);
        return total + item.qty;
      });
      console.log(result);
    }
  };

  const onRemove = () => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };
  return (
    <>
      <Header cartItems={cartItems} navigation={navigation} />
      <main>{children}</main>
    </>
  );
}
