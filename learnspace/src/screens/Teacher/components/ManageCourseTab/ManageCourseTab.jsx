import React from "react";
import {
  Layers,
  ListVideo,
  FolderPlus,
  FileText,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  FileQuestion,
  FileType,
  Pencil,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { totalLessons } from "../../../../data/TeacherData";
import { useTeacherDashboardContext } from "../../TeacherDashboardContext";
import "./ManageCourseTab.css";

const typeIcon = (type) => {
  if (type === "quiz")
    return <FileQuestion size={14} className="text-[#f59e0b]" />;
  if (type === "doc") return <FileType size={14} className="text-[#3b82f6]" />;
  return <PlayCircle size={14} className="text-[#8b5cf6]" />;
};

const ManageCourseTab = () => {
  const {
    selectedCourse,
    openSections,
    toggleSection,
    openAddLesson,
    handleDeleteSection,
    handleDeleteLesson,
    openEditCourse,
    openEditChapter,
    openEditLesson,
    handleMoveSection,
    handleMoveLesson,
  } = useTeacherDashboardContext();
  console.log(selectedCourse);

  return (
    <div className="manage-course-container">
      {/* Mini stats */}
      <div className="mini-stats-grid">
        {[
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
          <div key={label} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}

        <button
          onClick={() => openEditCourse(selectedCourse)}
          className="edit-course-btn"
        >
          <div className="stat-icon-wrapper bg-[rgba(59,130,246,0.08)]">
            <Pencil size={20} className="text-[#3b82f6]" />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#1c1d1f]">
              Chỉnh sửa
            </div>
            <div className="stat-label">Thông tin khóa học</div>
          </div>
        </button>
      </div>

      {/* Sections */}
      {selectedCourse.sections.length === 0 && (
        <div className="empty-sections-box">
          <FolderPlus size={40} className="opacity-40" />
          <p className="font-semibold">
            Chưa có chương nào. Nhấn "+ Thêm chương" để bắt đầu!
          </p>
        </div>
      )}

      <div className="sections-list">
        {selectedCourse.sections.map((section, sIdx) => (
          <div key={section.id} className="chapter-card">
            <div
              onClick={() => toggleSection(section.id)}
              className="chapter-header"
            >
              <div className="chapter-idx-box">
                <span className="chapter-idx-text">{sIdx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="chapter-title">{section.name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <FileText size={12} className="text-[#9ca3af]" />
                  <span className="text-xs text-[#9ca3af]">
                    {section.lessons.length} bài học
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddLesson(section.id);
                  }}
                  className="btn-add-lesson"
                >
                  <Plus size={13} />
                  Thêm bài học
                </button>
                <button
                  disabled={sIdx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSection(sIdx, "up");
                  }}
                  className="btn-order-change"
                  title="Di chuyển lên"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  disabled={sIdx === selectedCourse.sections.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveSection(sIdx, "down");
                  }}
                  className="btn-order-change"
                  title="Di chuyển xuống"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditChapter(section);
                  }}
                  className="btn-chapter-edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(selectedCourse.id, section.id);
                  }}
                  className="btn-chapter-delete"
                >
                  <Trash2 size={14} />
                </button>
                {openSections[section.id] ? (
                  <ChevronUp size={16} className="text-[#9ca3af]" />
                ) : (
                  <ChevronDown size={16} className="text-[#9ca3af]" />
                )}
              </div>
            </div>

            {openSections[section.id] && (
              <div className="border-t border-[#f3f4f6]">
                {section.lessons.length === 0 && (
                  <div className="empty-lessons">
                    Chưa có bài học. Hãy nhấn nút "+ Thêm bài học" để thêm mới!
                  </div>
                )}
                {section.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="group lesson-row">
                    <span className="lesson-idx">{lIdx + 1}</span>

                    {typeIcon(lesson.type)}

                    <span className="lesson-title">{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="lesson-free-badge">FREE</span>
                    )}
                    <span className="lesson-duration">{lesson.duration}</span>
                    <span className="lesson-type-tag">{lesson.type}</span>
                    <button
                      disabled={lIdx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveLesson(section.id, lIdx, "up");
                      }}
                      className="btn-lesson-order"
                      title="Di chuyển bài học lên"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      disabled={lIdx === section.lessons.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveLesson(section.id, lIdx, "down");
                      }}
                      className="btn-lesson-order"
                      title="Di chuyển bài học xuống"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditLesson(section.id, lesson);
                      }}
                      className="btn-lesson-edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLesson(section.id, lesson.id);
                      }}
                      className="btn-lesson-delete"
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
