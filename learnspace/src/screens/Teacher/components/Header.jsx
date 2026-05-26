import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";

const Header = ({ view, selectedCourse, onBackToCourses }) => {
  return (
    <header
      style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {view === "manage" && (
          <button
            onClick={onBackToCourses}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#8b5cf6",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              border: "none",
              background: "none",
              padding: 0,
            }}
          >
            <BookOpen size={15} /> Khóa học
          </button>
        )}
        {view === "manage" && (
          <ChevronRight size={14} style={{ color: "#9ca3af" }} />
        )}
        <h1 style={{ fontSize: "18px", fontWeight: 900, color: "#1c1d1f" }}>
          {view === "overview" && "Tổng quan"}
          {view === "courses" && "Khóa học của tôi"}
          {view === "manage" && (
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "320px",
                display: "inline-block",
              }}
            >
              {selectedCourse?.name || selectedCourse?.title}
            </span>
          )}
        </h1>
      </div>
    </header>
  );
};

export default Header;
