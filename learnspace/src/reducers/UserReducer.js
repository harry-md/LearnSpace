import cookies from "react-cookies";

export default (current, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      cookies.remove("token");
      cookies.remove("user");
      return null;
  }
  return current;
};
