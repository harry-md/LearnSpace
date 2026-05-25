import cookies from "react-cookies";

export default (current, action) => {
  switch (action.type) {
    case "LOGIN":
      cookies.save("user", action.payload, { path: "/" });
      return action.payload;
    case "LOGOUT":
      cookies.remove("user", { path: "/" });
      return null;
  }
  return current;
};
