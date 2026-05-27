import React from "react";
import "./GlobalLoading.css";

const GlobalLoading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="global-loading-overlay">
      <div className="cssloader">
        <div className="triangle1"></div>
        <div className="triangle2"></div>
        <p className="text">Đang xử lý...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
