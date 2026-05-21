import React from "react";
// 1. Import thêm 3 icon cần thiết cho bài học vào đây
import {
  Users,
  Layers,
  ListVideo,
  FolderPlus,
  GripVertical,
  FileText,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  FileQuestion,
  FileType,
} from "lucide-react";
import { totalLessons } from "../../../data/TeacherData";

// 2. Khai báo hàm helper ngay tại đây (nằm ngoài component để tránh re-create khi render)
const typeIcon = (type) => {
  if (type === "quiz")
    return <FileQuestion size={14} style={{ color: "#f59e0b" }} />;
  if (type === "doc")
    return <FileType size={14} style={{ color: "#3b82f6" }} />;
  return <PlayCircle size={14} style={{ color: "#8b5cf6" }} />;
};

// 3. Xóa prop typeIcon khỏi danh sách nhận vào
const ManageCourseTab = ({
  selectedCourse,
  openSections,
  toggleSection,
  openAddLesson,
  handleDeleteSection,
  handleDeleteLesson,

  // Props cho Drag & Drop
  draggedSectionIdx,
  handleSectionDragStart,
  handleSectionDragOver,
  handleSectionDrop,
  draggedLessonInfo,
  handleLessonDragStart,
  handleLessonDragOver,
  handleLessonDrop,
}) => {
  return (
    <div style={{ padding: "32px" }}>
      {/* Mini stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            icon: Users,
            label: "Học viên",
            value: selectedCourse.studentsCount.toLocaleString(),
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.08)",
          },
          {
            icon: Layers,
            label: "Chương",
            value: selectedCourse.sections.length,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.08)",
          },
          {
            icon: ListVideo,
            label: "Bài học",
            value: totalLessons(selectedCourse.sections),
            color: "#10b981",
            bg: "rgba(16,185,129,0.08)",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div
                style={{ fontSize: "22px", fontWeight: 900, color: "#1c1d1f" }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600 }}
              >
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {selectedCourse.sections.length === 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "2px dashed #e5e7eb",
            padding: "64px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            color: "#9ca3af",
          }}
        >
          <FolderPlus size={40} style={{ opacity: 0.4 }} />
          <p style={{ fontWeight: 600 }}>
            Chưa có chương nào. Nhấn "+ Thêm chương" để bắt đầu!
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {selectedCourse.sections.map((section, sIdx) => (
          <div
            key={section.id}
            draggable={true}
            onDragStart={(e) => handleSectionDragStart(e, sIdx)}
            onDragOver={handleSectionDragOver}
            onDrop={(e) => handleSectionDrop(e, sIdx)}
            style={{
              background: "white",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              opacity: draggedSectionIdx === sIdx ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <div
              onClick={() => toggleSection(section.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                userSelect: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              <GripVertical
                size={16}
                style={{ color: "#d1d5db", flexShrink: 0, cursor: "grab" }}
              />
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(139,92,246,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#8b5cf6",
                  }}
                >
                  {sIdx + 1}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#1c1d1f",
                  }}
                >
                  {section.title}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "3px",
                  }}
                >
                  <FileText size={12} style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {section.lessons.length} bài học
                  </span>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddLesson(section.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#8b5cf6",
                    border: "1px solid #c4b5fd",
                    borderRadius: "8px",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Plus size={13} />
                  Thêm bài học
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(selectedCourse.id, section.id);
                  }}
                  style={{
                    padding: "6px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#ef4444",
                    borderRadius: "6px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Trash2 size={14} />
                </button>
                {openSections[section.id] ? (
                  <ChevronUp size={16} style={{ color: "#9ca3af" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "#9ca3af" }} />
                )}
              </div>
            </div>

            {openSections[section.id] && (
              <div style={{ borderTop: "1px solid #f3f4f6" }}>
                {section.lessons.length === 0 && (
                  <div
                    onDragOver={handleLessonDragOver}
                    onDrop={(e) => handleLessonDrop(e, section.id, undefined)}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      fontSize: "13px",
                      color: "#9ca3af",
                      border: "2px dashed transparent",
                    }}
                  >
                    Chưa có bài học. Thêm hoặc kéo thả bài học vào đây!
                  </div>
                )}
                {section.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    draggable={true}
                    onDragStart={(e) =>
                      handleLessonDragStart(e, section.id, lIdx)
                    }
                    onDragOver={handleLessonDragOver}
                    onDrop={(e) => handleLessonDrop(e, section.id, lIdx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 20px 12px 28px",
                      borderBottom: "1px solid #f9fafb",
                      transition: "background 0.15s, opacity 0.2s",
                      opacity:
                        draggedLessonInfo?.sectionId === section.id &&
                        draggedLessonInfo?.lessonIdx === lIdx
                          ? 0.4
                          : 1,
                      cursor: "grab",
                    }}
                    className="group lesson-row"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <GripVertical
                      size={13}
                      style={{ color: "#9ca3af", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        width: "20px",
                        flexShrink: 0,
                        fontWeight: 600,
                      }}
                    >
                      {lIdx + 1}
                    </span>

                    {/* 4. Gọi trực tiếp hàm helper cùng file ở đây */}
                    {typeIcon(lesson.type)}

                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        color: "#374151",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lesson.title}
                    </span>
                    {lesson.isFree && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#059669",
                          border: "1px solid #a7f3d0",
                          background: "#ecfdf5",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          flexShrink: 0,
                        }}
                      >
                        FREE
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        flexShrink: 0,
                      }}
                    >
                      {lesson.duration}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        background: "#f3f4f6",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        flexShrink: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {lesson.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLesson(section.id, lesson.id);
                      }}
                      style={{
                        padding: "4px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#ef4444",
                        opacity: 0,
                        borderRadius: "4px",
                        transition: "opacity 0.15s, background 0.15s",
                        flexShrink: 0,
                      }}
                      className="del-btn"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = 1;
                        e.currentTarget.style.background =
                          "rgba(239,68,68,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = 0;
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCourseTab;
