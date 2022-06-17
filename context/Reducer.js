// Shopping Cart Reducer

// Initial Cart State

const initialCart = [];

export const cartInitializer = (initialValue = initialCart) => {
  if (typeof window !== "undefined") {
    const localCart = localStorage.getItem("localCart");
    if (localCart) {
      return JSON.parse(localStorage.getItem("localCart"));
    } else {
      return initialValue;
    }
  }
};

// Cart Reducer

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.id === action.item.id
              ? {
                  ...item,
                  quantity: item.quantity + action.qty,
                }
              : { ...item, quantity: 1 }
          )
        : [...state, { ...action.item, quantity: 1 }];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.item.id);

    case "DECREMENT_QUANTITY":
      // if quantity is 1 remove from cart, otherwise decrement quantity
      return state.find((item) => item.name === action.item.name)?.quantity ===
        1
        ? state.filter((item) => item.name !== action.item.name)
        : state.map((item) =>
            item.name === action.item.name
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          );
    case "SET_QUANTITY":
      // if quantity is 1 remove from cart, otherwise decrement quantity
      const result = state.map((item) => item.name === action.item.name);
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.name === action.item.name
              ? {
                  ...item,
                  quantity: parseInt(action.payload),
                }
              : item
          )
        : item;

    case "CLEAR_CART":
      return initialCart;

    default:
      return state;
  }
};

// Reducer Functions

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

// Wishlist Reducer

// Initial Wishlist State

const initialWishList = [];

export const wishListInitializer = (initialValue = initialWishList) => {
  if (typeof window !== "undefined") {
    const localWishList = localStorage.getItem("wishlist");
    if (localWishList) {
      return JSON.parse(localStorage.getItem("wishlist"));
    } else {
      return initialValue;
    }
  }
};

// Wishlist Reducer

export const wishListReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return state.find((item) => item.id === action.item.id)
        ? state.map((item) =>
            item.id === action.item.id
              ? {
                  ...item,
                }
              : item
          )
        : [...state, { ...action.item }];
    case "REMOVE_FROM_WISHLIST":
      return state.filter((item) => item.id !== action.item.id);
    case "CLEAR_WISHLIST":
      return initialState;
    default:
      return state;
  }
};

// Reducer Functions

export const addToWishList = (item) => ({
  type: "ADD_TO_WISHLIST",
  item,
});

export const removeFromWishList = (item) => ({
  type: "REMOVE_FROM_WISHLIST",
  item,
});

export const clearWishList = () => ({
  type: "CLEAR_WISHLIST",
});
