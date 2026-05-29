import cookies from "react-cookies";

const CartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_COURSE": {
      const isExist = state.carts.some((cart) => cart.id === action.payload.id);
      if (isExist) {
        return state;
      }
      cookies.save("carts", [...state.carts, action.payload], { path: "/" });
      return {
        ...state,
        carts: [...state.carts, action.payload],
      };
    }
    case "REMOVE_COURSE": {
      const newCarts = state.carts.filter(
        (cart) => cart.id !== action.payload.id,
      );
      cookies.save("carts", newCarts, { path: "/" });
      return {
        ...state,
        carts: newCarts,
      };
    }
    case "CLEAR_CART": {
      cookies.remove("carts", { path: "/" });
      return {
        ...state,
        carts: [],
      };
    }
    default:
      return state;
  }
};

export default CartReducer;
