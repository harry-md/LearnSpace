import React, { useState, useEffect } from "react";
import { FolderPlus } from "lucide-react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./AddChapterModal.css";

const AddChapterModal = ({ open, onClose, onSubmit, course }) => {
  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      setChapterForm({ title: "", description: "" });
    }
  }, [open]);

  const handleAdd = () => {
    if (!chapterForm.title.trim()) return;
    onSubmit({
      title: chapterForm.title,
      description: chapterForm.description,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Thêm chương mới">
      <Field label="Tên chương" required>
        <input
          className="input-cls"
          placeholder="Tên chương"
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
          className="input-cls add-chapter-modal-textarea"
          rows={3}
          placeholder="Tóm tắt nội dung chương"
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
      <div className="add-chapter-modal-footer">
        <button onClick={onClose} className="add-chapter-modal-btn-cancel">
          Hủy bỏ
        </button>
        <button onClick={handleAdd} className="add-chapter-modal-btn-submit">
          <FolderPlus size={16} />
          Thêm vào khóa học
        </button>
      </div>
    </Modal>
  );
};

export default AddChapterModal;
