import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../configs/Context";
import { jwtDecode } from "jwt-decode";
import Error403 from "@/screens/Error/Error403";
import RequiredLogin from "@/screens/Error/RequiredLogin";
import "./ProtectedRoute.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user] = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkRole = () => {
      if (!user || !user.token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const decoded = jwtDecode(user.token);
        const userRoles = decoded.role;
        const rolesArray =
          typeof userRoles === "string"
            ? [userRoles]
            : Array.isArray(userRoles)
              ? userRoles
              : [];
        const hasRequiredRole = allowedRoles.some((role) =>
          rolesArray.includes(role),
        );

        setIsAuthorized(hasRequiredRole);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        setIsAuthorized(false);
      }
    };

    checkRole();
  }, [user, allowedRoles]);

  if (!user || !user.token) {
    return <RequiredLogin />;
  }

  if (isAuthorized === null) {
    return (
      <div className="protected-route-loading">
        <h4>Đang kiểm tra quyền truy cập...</h4>
      </div>
    );
  }

  if (isAuthorized === false) {
    return <Error403 />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
