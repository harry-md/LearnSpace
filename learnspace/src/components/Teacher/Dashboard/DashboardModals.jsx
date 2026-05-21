import React from "react";
import {
  Image,
  PlusCircle,
  FolderPlus,
  BookMarked,
  BookOpen,
} from "lucide-react";
import { Modal, Field, inputCls, inputStyle } from "./UIComponent";
import { CATEGORIES, LEVELS, LESSON_TYPES } from "../../../data/TeacherData";

const DashboardModals = ({
  modal,
  setModal,

  // Create Course Props
  courseForm,
  setCourseForm,
  handleCreateCourse,

  // Add Chapter Props
  chapterTab,
  setChapterTab,
  chapterForm,
  setChapterForm,
  handleAddChapter,
  allSections,
  chapterTargetCourseId,
  selectedExistingSection,
  setSelectedExistingSection,

  // Add Lesson Props
  lessonForm,
  setLessonForm,
  handleAddLesson,
}) => {
  return (
    <>
      {/* ── CREATE COURSE MODAL ── */}
      <Modal
        open={modal === "create-course"}
        onClose={() => setModal(null)}
        title="Tạo khóa học mới"
        wide
      >
        <Field
          label="Tên khóa học"
          required
          hint="Hãy dùng tiêu đề rõ ràng, hấp dẫn để thu hút học viên"
        >
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="VD: Python từ cơ bản đến nâng cao"
            value={courseForm.title}
            onChange={(e) =>
              setCourseForm({ ...courseForm, title: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
        <Field label="Mô tả ngắn">
          <textarea
            className={inputCls}
            style={{ ...inputStyle, resize: "none" }}
            rows={3}
            placeholder="Mô tả tổng quan về khóa học..."
            value={courseForm.description}
            onChange={(e) =>
              setCourseForm({ ...courseForm, description: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Field label="Danh mục">
            <select
              className={inputCls}
              style={{ ...inputStyle, cursor: "pointer" }}
              value={courseForm.category}
              onChange={(e) =>
                setCourseForm({ ...courseForm, category: e.target.value })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Cấp độ">
            <select
              className={inputCls}
              style={{ ...inputStyle, cursor: "pointer" }}
              value={courseForm.level}
              onChange={(e) =>
                setCourseForm({ ...courseForm, level: e.target.value })
              }
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Giá (VND)">
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="VD: 499.000 ₫"
            value={courseForm.price}
            onChange={(e) =>
              setCourseForm({ ...courseForm, price: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
        <Field label="Ảnh bìa khóa học">
          <div
            style={{
              border: "2px dashed #e5e7eb",
              borderRadius: "12px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (
              (e.currentTarget.style.borderColor = "#8b5cf6"),
              (e.currentTarget.style.background = "rgba(139,92,246,0.04)")
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.borderColor = "#e5e7eb"),
              (e.currentTarget.style.background = "#fafafa")
            )}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(139,92,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image size={24} style={{ color: "#8b5cf6" }} />
            </div>
            <span
              style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}
            >
              Kéo thả hoặc click để upload ảnh
            </span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              PNG, JPG – tối đa 5MB, khuyến nghị 1280×720px
            </span>
          </div>
        </Field>
        <div
          style={{
            display: "flex",
            gap: "12px",
            paddingTop: "16px",
            borderTop: "1px solid #f3f4f6",
            marginTop: "4px",
          }}
        >
          <button
            onClick={() => setModal(null)}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontWeight: 700,
              borderRadius: "10px",
              cursor: "pointer",
              background: "white",
              fontSize: "14px",
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleCreateCourse}
            style={{
              flex: 1,
              padding: "12px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <PlusCircle size={16} />
            Tạo khóa học
          </button>
        </div>
      </Modal>

      {/* ── ADD CHAPTER MODAL ── */}
      <Modal
        open={modal === "add-chapter"}
        onClose={() => setModal(null)}
        title="Thêm chương vào khóa học"
        wide
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "4px",
            background: "#f3f4f6",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {[
            { id: "new", label: "Tạo chương mới", icon: FolderPlus },
            { id: "existing", label: "Chọn chương có sẵn", icon: BookMarked },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setChapterTab(id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
                transition: "all 0.15s",
                background: chapterTab === id ? "white" : "transparent",
                color: chapterTab === id ? "#7c3aed" : "#6b7280",
                boxShadow:
                  chapterTab === id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        {chapterTab === "new" ? (
          <>
            <Field label="Tên chương" required>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="VD: Array & Hashing"
                value={chapterForm.title}
                onChange={(e) =>
                  setChapterForm({ ...chapterForm, title: e.target.value })
                }
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </Field>
            <Field label="Mô tả chương">
              <textarea
                className={inputCls}
                style={{ ...inputStyle, resize: "none" }}
                rows={3}
                placeholder="Tóm tắt nội dung chương..."
                value={chapterForm.description}
                onChange={(e) =>
                  setChapterForm({
                    ...chapterForm,
                    description: e.target.value,
                  })
                }
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </Field>
          </>
        ) : (
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "12px",
              }}
            >
              Chọn chương có sẵn từ các khóa học khác (sẽ tạo bản sao):
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "260px",
                overflowY: "auto",
              }}
            >
              {allSections
                .filter((s) => s.courseId !== chapterTargetCourseId)
                .map((section) => {
                  const isSelected =
                    selectedExistingSection?.id === section.id &&
                    selectedExistingSection?.courseId === section.courseId;
                  return (
                    <button
                      key={`${section.courseId}-${section.id}`}
                      onClick={() => setSelectedExistingSection(section)}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: `2px solid ${isSelected ? "#8b5cf6" : "#e5e7eb"}`,
                        background: isSelected
                          ? "rgba(139,92,246,0.06)"
                          : "white",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "#1c1d1f",
                          marginBottom: "4px",
                        }}
                      >
                        {section.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <BookOpen size={12} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                          Từ: {section.courseName} · {section.lessons.length}{" "}
                          bài học
                        </span>
                      </div>
                    </button>
                  );
                })}
              {allSections.filter((s) => s.courseId !== chapterTargetCourseId)
                .length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#9ca3af",
                    fontSize: "13px",
                  }}
                >
                  Không có chương nào từ khóa học khác để chọn.
                </div>
              )}
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "12px",
            paddingTop: "16px",
            borderTop: "1px solid #f3f4f6",
            marginTop: "16px",
          }}
        >
          <button
            onClick={() => setModal(null)}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontWeight: 700,
              borderRadius: "10px",
              cursor: "pointer",
              background: "white",
              fontSize: "14px",
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleAddChapter}
            style={{
              flex: 1,
              padding: "12px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <FolderPlus size={16} />
            Thêm vào khóa học
          </button>
        </div>
      </Modal>

      {/* ── ADD LESSON MODAL ── */}
      <Modal
        open={modal === "add-lesson"}
        onClose={() => setModal(null)}
        title="Tạo bài học mới"
      >
        <Field label="Tiêu đề bài học" required>
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="VD: Two Sum – Bài kinh điển LeetCode"
            value={lessonForm.title}
            onChange={(e) =>
              setLessonForm({ ...lessonForm, title: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
        <Field label="Loại bài học">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {LESSON_TYPES.map(({ value, label, icon: Icon, color }) => {
              const active = lessonForm.type === value;
              return (
                <button
                  key={value}
                  onClick={() => setLessonForm({ ...lessonForm, type: value })}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "16px 8px",
                    borderRadius: "12px",
                    border: `2px solid ${active ? "#8b5cf6" : "#e5e7eb"}`,
                    background: active ? "rgba(139,92,246,0.06)" : "white",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: active ? "rgba(139,92,246,0.15)" : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      size={22}
                      style={{ color: active ? "#7c3aed" : "#9ca3af" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: active ? "#7c3aed" : "#6b7280",
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>
        <Field label={lessonForm.type === "quiz" ? "Số câu hỏi" : "Thời lượng"}>
          <input
            className={inputCls}
            style={inputStyle}
            placeholder={
              lessonForm.type === "quiz" ? "VD: 10 câu" : "VD: 15:30"
            }
            value={lessonForm.duration}
            onChange={(e) =>
              setLessonForm({ ...lessonForm, duration: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
        {lessonForm.type === "video" && (
          <Field
            label="URL Video"
            hint="YouTube, Vimeo hoặc đường dẫn CDN trực tiếp"
          >
            <input
              className={inputCls}
              style={inputStyle}
              placeholder="https://..."
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </Field>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px",
            background: "rgba(16,185,129,0.06)",
            borderRadius: "12px",
            border: "1px solid rgba(16,185,129,0.15)",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              setLessonForm({ ...lessonForm, isFree: !lessonForm.isFree })
            }
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              background: lessonForm.isFree ? "#10b981" : "#d1d5db",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: lessonForm.isFree ? "22px" : "2px",
                width: "20px",
                height: "20px",
                background: "white",
                borderRadius: "50%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }}
            />
          </button>
          <div>
            <div
              style={{ fontSize: "13px", fontWeight: 700, color: "#065f46" }}
            >
              Cho phép xem trước miễn phí
            </div>
            <div style={{ fontSize: "12px", color: "#047857" }}>
              Học viên chưa mua có thể xem thử bài này
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            paddingTop: "16px",
            borderTop: "1px solid #f3f4f6",
            marginTop: "8px",
          }}
        >
          <button
            onClick={() => setModal(null)}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
              fontWeight: 700,
              borderRadius: "10px",
              cursor: "pointer",
              background: "white",
              fontSize: "14px",
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleAddLesson}
            style={{
              flex: 1,
              padding: "12px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <PlusCircle size={16} />
            Tạo bài học
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DashboardModals;
