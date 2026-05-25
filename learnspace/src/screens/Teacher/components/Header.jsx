import React from "react";
import { BookOpen, ChevronRight, PlusCircle, FolderPlus } from "lucide-react";
import { useTeacherDashboardContext } from "../TeacherDashboardContext";

const Header = () => {
  const { view, setView, selectedCourse, setModal, openAddChapter } =
    useTeacherDashboardContext();

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
            onClick={() => setView("courses")}
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
              {selectedCourse?.title}
            </span>
          )}
        </h1>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        {view === "courses" && (
          <button
            onClick={() => setModal("create-course")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(86,36,208,0.3)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4712c4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#5624d0")}
          >
            <PlusCircle size={16} /> Tạo khóa học mới
          </button>
        )}
        {view === "manage" && selectedCourse && (
          <button
            onClick={() => openAddChapter()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              boxShadow: "0 4px 12px rgba(86,36,208,0.3)",
            }}
          >
            <FolderPlus size={16} /> Thêm chương
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
