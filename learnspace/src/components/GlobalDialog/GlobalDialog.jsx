import React from "react";
import "./GlobalDialog.css";

const GlobalDialog = ({
  show,
  title = "Thông báo",
  message = "",
  type = "info",
  onConfirm,
  onClose,
}) => {
  if (!show) return null;

  const getColor = () => {
    switch (type) {
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      default:
        return "#5624d0";
    }
  };

  const color = getColor();

  return (
    <div className="global-dialog-overlay">
      <div className="global-dialog-backdrop" onClick={onClose} />
      <div className="global-dialog-container">
        <div
          className="global-dialog-icon-wrapper"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {type === "success" && "✓"}
          {type === "error" && "✗"}
          {type === "warning" && "!"}
          {type === "info" && "i"}
        </div>
        <div>
          <h3 className="global-dialog-title">{title}</h3>
          <p className="global-dialog-message">{message}</p>
        </div>
        <div className="global-dialog-actions">
          {onConfirm && (
            <button className="global-dialog-btn-cancel" onClick={onClose}>
              Hủy
            </button>
          )}
          <button
            className="global-dialog-btn-confirm"
            style={{ backgroundColor: color }}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalDialog;
