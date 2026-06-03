import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./EditLessonModal.css";

const EditLessonModal = ({ open, onClose, lesson, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoFile: null,
  });

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title || "",
        content: lesson.content || "",
        videoFile: null,
      });
    }
  }, [lesson]);

  const handleUpdate = () => {
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Chỉnh sửa bài học">
      <Field label="Tiêu đề bài học" required>
        <input
          className="input-cls"
          placeholder="VD: Two Sum – Bài kinh điển LeetCode"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      <Field label="Mô tả bài học">
        <textarea
          className="input-cls edit-lesson-modal-textarea"
          rows={3}
          placeholder="Tóm tắt nội dung bài học..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      <Field
        label="Thay video bài học"
        hint="Để trống nếu không muốn thay video cũ"
      >
        <label
          className={`edit-lesson-file-label ${form.videoFile ? "has-file" : ""}`}
        >
          <input
            type="file"
            accept="video/mp4"
            className="edit-lesson-file-input"
            onChange={(e) =>
              setForm({ ...form, videoFile: e.target.files[0] || null })
            }
          />
          <div
            className={`edit-lesson-file-icon-wrapper ${form.videoFile ? "has-file" : ""}`}
          >
            <Video
              size={20}
              className={`edit-lesson-file-icon ${form.videoFile ? "has-file" : ""}`}
            />
          </div>
          <span
            className={`edit-lesson-file-text ${form.videoFile ? "has-file" : ""}`}
          >
            {form.videoFile
              ? `${form.videoFile.name}`
              : "Click để chọn file .mp4 mới"}
          </span>
        </label>
      </Field>

      <div className="edit-lesson-modal-footer">
        <button onClick={onClose} className="edit-lesson-modal-btn-cancel">
          Hủy bỏ
        </button>
        <button onClick={handleUpdate} className="edit-lesson-modal-btn-submit">
          Lưu thay đổi
        </button>
      </div>
    </Modal>
  );
};

export default EditLessonModal;
