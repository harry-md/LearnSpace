import React from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: "1.25rem",
          boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: wide ? "44rem" : "34rem",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid #f3f4f6" }}
        >
          <h3 className="text-xl font-black" style={{ color: "#1c1d1f" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors cursor-pointer"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <X size={20} style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-7 py-6">{children}</div>
      </div>
    </div>
  );
}
