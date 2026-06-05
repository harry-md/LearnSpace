import React, { useState, useEffect, useContext } from "react";
import { PlusCircle, Video } from "lucide-react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./AddLessonModal.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";
import { UIContext } from "@/configs/Context";

const AddLessonModal = ({ open, onClose, onSubmit }) => {
  const [, uiDispatch] = useContext(UIContext);
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoFile: null,
  });

  useEffect(() => {
    if (open) {
      setForm({ title: "", content: "", videoFile: null });
    }
  }, [open]);

  const handleAdd = () => {
    if (!form.title.trim()) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          show: true,
          title: "Lỗi",
          message: "Vui lòng nhập tiêu đề bài học.",
          actions: [
            {
              label: "Đóng",
              onClick: () => uiDispatch({ type: "HIDE_DIALOG" }),
            },
          ],
        },
      });
      return;
    }
    if (!form.videoFile) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          show: true,
          title: "Lỗi",
          message: "Vui lòng chọn file video cho bài học.",
          actions: [
            {
              label: "Đóng",
              onClick: () => uiDispatch({ type: "HIDE_DIALOG" }),
            },
          ],
        },
      });
      return;
    }
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo bài học mới">
      <Field label="Tiêu đề bài học" required>
        <input
          className="input-cls"
          placeholder="Tiêu đề bài học"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      <Field label="Mô tả bài học">
        <textarea
          className="input-cls add-lesson-modal-textarea"
          rows={3}
          placeholder="Tóm tắt nội dung bài học"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      <Field label="File video bài học" required hint="Chỉ chấp nhận file .mp4">
        <label
          className={`add-lesson-file-label ${form.videoFile ? "has-file" : ""}`}
        >
          <input
            type="file"
            accept="video/mp4"
            className="add-lesson-file-input"
            onChange={(e) => setForm({ ...form, videoFile: e.target.files[0] })}
          />
          <div
            className={`add-lesson-file-icon-wrapper ${form.videoFile ? "has-file" : ""}`}
          >
            <Video
              size={20}
              className={`add-lesson-file-icon ${form.videoFile ? "has-file" : ""}`}
            />
          </div>
          <span
            className={`add-lesson-file-text ${form.videoFile ? "has-file" : ""}`}
          >
            {form.videoFile
              ? `${form.videoFile.name}`
              : "Click để chọn file .mp4"}
          </span>
        </label>
      </Field>

      <div className="add-lesson-modal-footer">
        <button onClick={onClose} className="add-lesson-modal-btn-cancel">
          Hủy bỏ
        </button>
        <button onClick={handleAdd} className="add-lesson-modal-btn-submit">
          <PlusCircle size={16} />
          Tạo bài học
        </button>
      </div>
    </Modal>
  );
};

export default AddLessonModal;
