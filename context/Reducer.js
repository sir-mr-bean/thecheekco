const initialState = [];

export const initializer = (initialValue = initialState) => {
  if (typeof window !== "undefined") {
    const localCart = localStorage.getItem("localCart");
    if (localCart) {
      //console.log("found local cart!");
      //console.log(localCart);
      return JSON.parse(localStorage.getItem("localCart"));
    } else {
      console.log("no local cart found");
      return initialValue;
    }
  }
};

export const cartReducer = (state, action) => {
  console.log(state);
  console.log(action);
  switch (action.type) {
    case "ADD_TO_CART":
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.id === action.item.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          )
        : [...state, { ...action.item, quantity: 1 }];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.item.id);

    case "DECREMENT_QUANTITY":
      // if quantity is 1 remove from cart, otherwise decrement quantity
      return state.find((item) => item.name === action.item.attributes.name)
        ?.quantity === 1
        ? state.filter((item) => item.name !== action.item.attributes.name)
        : state.map((item) =>
            item.name === action.item.attributes.name
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          );

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

export const addToCart = (item) => ({
  type: "ADD_TO_CART",
  item,
});

export const decrementItemQuantity = (item) => ({
  type: "DECREMENT_QUANTITY",
  item,
});

export const removeFromCart = (item) => ({
  type: "REMOVE_FROM_CART",
  item,
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});
