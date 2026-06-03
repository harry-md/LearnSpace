import React from "react";

export function Field({ label, required, hint, children }) {
  return (
    <div className="mb-5">
      <label
        className="block text-sm font-bold mb-1.5"
        style={{ color: "#1c1d1f" }}
      >
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {hint && (
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
