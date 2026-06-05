import React from "react";
import "./StatCard.css";

const StatCard = ({ icon: Icon, color, bgColor, value, label, subLabel }) => {
  return (
    <div
      className="overview-stat-card"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div
        className="stat-icon-container"
        style={{ background: bgColor }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <div className="stat-num-val">{value}</div>
        <div className="stat-num-label">{label}</div>
        {subLabel && <div className="stat-num-sub">{subLabel}</div>}
      </div>
    </div>
  );
};

export default StatCard;
