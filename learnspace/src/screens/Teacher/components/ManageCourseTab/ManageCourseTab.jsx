import React, { useState } from "react";
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
  Pencil,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import AddChapterModal from "../Modals/AddChapterModal";
import EditChapterModal from "../Modals/EditChapterModal";
import AddLessonModal from "../Modals/AddLessonModal";
import EditLessonModal from "../Modals/EditLessonModal";
import EditCourseModal from "../Modals/EditCourseModal";
import "./ManageCourseTab.css";

const ManageCourseTab = ({ course }) => {
  const [openSections, setOpenSections] = useState({ 1: true });

  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showEditChapter, setShowEditChapter] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className="manage-course-container">
      {/* Mini stats */}
      <div className="mini-stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon-wrapper"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            <Layers size={20} style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <div className="stat-value">2</div>
            <div className="stat-label">Chương</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon-wrapper"
            style={{ background: "rgba(16,185,129,0.08)" }}
          >
            <ListVideo size={20} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">Bài học</div>
          </div>
        </div>

        {/* Nút sửa thông tin khóa học */}
        <button
          onClick={() => setShowEditCourse(true)}
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

        {/* Nút thêm chương */}
        <button
          onClick={() => setShowAddChapter(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            background: "white",
            border: "2px dashed #d1d5db",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8b5cf6")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
        >
          <div className="stat-icon-wrapper bg-[rgba(139,92,246,0.08)]">
            <FolderPlus size={20} className="text-[#8b5cf6]" />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#1c1d1f]">
              Thêm chương
            </div>
            <div className="stat-label">Tạo chương mới</div>
          </div>
        </button>
      </div>

      {/* Danh sách chương */}
      <div className="sections-list">
        {/* Chương 1 */}
        <div className="chapter-card">
          <div onClick={() => toggleSection(1)} className="chapter-header">
            <div className="chapter-idx-box">
              <span className="chapter-idx-text">1</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="chapter-title">Chương 1: Giới thiệu</span>
              <div className="flex items-center gap-2 mt-0.5">
                <FileText size={12} className="text-[#9ca3af]" />
                <span className="text-xs text-[#9ca3af]">2 bài học</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddLesson(true);
                }}
                className="btn-add-lesson"
              >
                <Plus size={13} />
                Thêm bài học
              </button>
              <button
                className="btn-order-change"
                title="Di chuyển lên"
                disabled
              >
                <ArrowUp size={14} />
              </button>
              <button className="btn-order-change" title="Di chuyển xuống">
                <ArrowDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditChapter(true);
                }}
                className="btn-chapter-edit"
              >
                <Pencil size={14} />
              </button>
              <button className="btn-chapter-delete">
                <Trash2 size={14} />
              </button>
              {openSections[1] ? (
                <ChevronUp size={16} className="text-[#9ca3af]" />
              ) : (
                <ChevronDown size={16} className="text-[#9ca3af]" />
              )}
            </div>
          </div>

          {openSections[1] && (
            <div className="border-t border-[#f3f4f6]">
              {/* Bài học 1.1 */}
              <div className="group lesson-row">
                <span className="lesson-idx">1</span>
                <PlayCircle size={14} className="text-[#8b5cf6]" />
                <span className="lesson-title">Giới thiệu khóa học</span>
                <span className="lesson-free-badge">FREE</span>
                <span className="lesson-duration">2:05</span>
                <button className="btn-lesson-order" disabled>
                  <ArrowUp size={13} />
                </button>
                <button className="btn-lesson-order">
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => setShowEditLesson(true)}
                  className="btn-lesson-edit"
                >
                  <Pencil size={13} />
                </button>
                <button className="btn-lesson-delete">
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Bài học 1.2 */}
              <div className="group lesson-row">
                <span className="lesson-idx">2</span>
                <PlayCircle size={14} className="text-[#8b5cf6]" />
                <span className="lesson-title">Cài đặt môi trường</span>
                <span className="lesson-duration">7:30</span>
                <button className="btn-lesson-order">
                  <ArrowUp size={13} />
                </button>
                <button className="btn-lesson-order" disabled>
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => setShowEditLesson(true)}
                  className="btn-lesson-edit"
                >
                  <Pencil size={13} />
                </button>
                <button className="btn-lesson-delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chương 2 */}
        <div className="chapter-card">
          <div onClick={() => toggleSection(2)} className="chapter-header">
            <div className="chapter-idx-box">
              <span className="chapter-idx-text">2</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="chapter-title">Chương 2: Kiến thức cơ bản</span>
              <div className="flex items-center gap-2 mt-0.5">
                <FileText size={12} className="text-[#9ca3af]" />
                <span className="text-xs text-[#9ca3af]">2 bài học</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddLesson(true);
                }}
                className="btn-add-lesson"
              >
                <Plus size={13} />
                Thêm bài học
              </button>
              <button className="btn-order-change" title="Di chuyển lên">
                <ArrowUp size={14} />
              </button>
              <button
                className="btn-order-change"
                title="Di chuyển xuống"
                disabled
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditChapter(true);
                }}
                className="btn-chapter-edit"
              >
                <Pencil size={14} />
              </button>
              <button className="btn-chapter-delete">
                <Trash2 size={14} />
              </button>
              {openSections[2] ? (
                <ChevronUp size={16} className="text-[#9ca3af]" />
              ) : (
                <ChevronDown size={16} className="text-[#9ca3af]" />
              )}
            </div>
          </div>

          {openSections[2] && (
            <div className="border-t border-[#f3f4f6]">
              {/* Bài học 2.1 */}
              <div className="group lesson-row">
                <span className="lesson-idx">1</span>
                <PlayCircle size={14} className="text-[#8b5cf6]" />
                <span className="lesson-title">Biến và Kiểu dữ liệu</span>
                <span className="lesson-duration">10:00</span>
                <button className="btn-lesson-order" disabled>
                  <ArrowUp size={13} />
                </button>
                <button className="btn-lesson-order">
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => setShowEditLesson(true)}
                  className="btn-lesson-edit"
                >
                  <Pencil size={13} />
                </button>
                <button className="btn-lesson-delete">
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Bài học 2.2 */}
              <div className="group lesson-row">
                <span className="lesson-idx">2</span>
                <FileQuestion size={14} className="text-[#f59e0b]" />
                <span className="lesson-title">
                  Bài tập trắc nghiệm chương 2
                </span>
                <button className="btn-lesson-order">
                  <ArrowUp size={13} />
                </button>
                <button className="btn-lesson-order" disabled>
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => setShowEditLesson(true)}
                  className="btn-lesson-edit"
                >
                  <Pencil size={13} />
                </button>
                <button className="btn-lesson-delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODALS ─────────────────────────────────────────── */}
      <AddChapterModal
        open={showAddChapter}
        onClose={() => setShowAddChapter(false)}
        onSubmit={() => setShowAddChapter(false)}
      />

      <EditChapterModal
        open={showEditChapter}
        onClose={() => setShowEditChapter(false)}
        chapter={{ name: "Chương mẫu" }}
        onSubmit={() => setShowEditChapter(false)}
      />

      <AddLessonModal
        open={showAddLesson}
        onClose={() => setShowAddLesson(false)}
        onSubmit={() => setShowAddLesson(false)}
      />

      <EditLessonModal
        open={showEditLesson}
        onClose={() => setShowEditLesson(false)}
        lesson={{ title: "Bài học mẫu" }}
        onSubmit={() => setShowEditLesson(false)}
      />

      <EditCourseModal
        open={showEditCourse}
        onClose={() => setShowEditCourse(false)}
        course={course}
        categories={[
          { id: 1, name: "Lập trình" },
          { id: 2, name: "Thiết kế" },
        ]}
        user={{}}
        onSuccess={() => setShowEditCourse(false)}
      />
    </div>
  );
};

export default ManageCourseTab;
