import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Modal, Field, inputCls, inputStyle } from "../UIComponent";
import { LESSON_TYPES } from "../../../../data/TeacherData";

const AddLessonModal = ({ open, onClose, onSubmit }) => {
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video",
    duration: "",
    isFree: false,
  });

  useEffect(() => {
    if (open) {
      setLessonForm({
        title: "",
        type: "video",
        duration: "",
        isFree: false,
      });
    }
  }, [open]);

  const handleAdd = () => {
    if (!lessonForm.title.trim()) return;
    onSubmit(lessonForm);
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo bài học mới">
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
          onClick={onClose}
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
          onClick={handleAdd}
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
  );
};

export default AddLessonModal;
