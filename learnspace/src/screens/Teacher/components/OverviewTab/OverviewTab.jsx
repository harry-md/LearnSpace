import React from "react";
import { BookOpen, Layers, Video, ArrowRight } from "lucide-react";
import { useTeacherDashboardContext } from "../../TeacherDashboardContext";
import "./OverviewTab.css";

const OverviewTab = () => {
  const {
    courses,
    totalSections,
    totalLessonsAll,
    openManage,
  } = useTeacherDashboardContext();

  return (
    <div className="overview-container">
      {/* Stats grid */}
      <div className="stats-grid">
        {[
          {
            icon: BookOpen,
            label: "Khóa học",
            value: courses.length,
            sub: `${courses.filter((c) => c.active).length} đã xuất bản`,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.08)",
            border: "#8b5cf6",
          },
          {
            icon: Layers,
            label: "Tổng chương",
            value: totalSections,
            sub: "Tất cả khóa học",
            color: "#10b981",
            bg: "rgba(16,185,129,0.08)",
            border: "#10b981",
          },
          {
            icon: Video,
            label: "Tổng bài học",
            value: totalLessonsAll,
            sub: "Video, Quiz, Tài liệu",
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
            border: "#f59e0b",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
          <div
            key={label}
            className="overview-stat-card"
            style={{
              borderLeft: `4px solid ${border}`,
            }}
          >
            <div
              className="stat-icon-container"
              style={{
                background: bg,
              }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <div className="stat-num-val">
                {value}
              </div>
              <div className="stat-num-label">
                {label}
              </div>
              <div className="stat-num-sub">
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course List */}
      <div className="course-list-wrapper">
        <div className="course-list-header">
          <BookOpen size={18} className="text-[#8b5cf6]" />
          <h2 className="course-list-title">
            Khóa học của bạn
          </h2>
        </div>
        {courses.map((c, idx) => (
          <div
            key={c.id}
            className="course-row-item"
            style={{
              borderBottom:
                idx < courses.length - 1 ? "1px solid #f9fafb" : "none",
            }}
            onClick={() => openManage(c)}
          >
            <img
              src={c.image}
              alt={c.title}
              className="course-row-thumb"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <span className="course-row-title">
                  {c.title}
                </span>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="course-row-price">
                    {c.price.toLocaleString()} ₫
                  </span>
                  <span
                    className={`course-row-badge ${c.active ? "active" : "draft"}`}
                  >
                    {c.active ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#9ca3af]">
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;
