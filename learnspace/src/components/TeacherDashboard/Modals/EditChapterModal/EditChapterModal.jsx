import React, { useState, useEffect } from "react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./EditChapterModal.css";
import { Save } from "lucide-react";

const EditChapterModal = ({ open, onClose, chapter, onSubmit }) => {
  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (chapter) {
      setChapterForm({
        title: chapter.title || "",
        description: chapter.description || "",
      });
    }
  }, [chapter]);

  const handleUpdate = () => {
    if (!chapterForm.title.trim()) return;
    onSubmit({
      title: chapterForm.title,
      description: chapterForm.description,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Chỉnh sửa chương">
      <Field label="Tên chương" required>
        <input
          className="input-cls"
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
          className="input-cls edit-chapter-modal-textarea"
          rows={3}
          placeholder="Tóm tắt nội dung chương..."
          value={chapterForm.description}
          onChange={(e) =>
            setChapterForm({
              ...chapterForm,
              description: e.target.value,
            })
          }
        />
      </Field>
      <div className="edit-chapter-modal-footer">
        <button onClick={onClose} className="edit-chapter-modal-btn-cancel">
          Hủy bỏ
        </button>
        <button
          onClick={handleUpdate}
          className="edit-chapter-modal-btn-submit"
        >
          <Save size={16} />
          Lưu thay đổi
        </button>
      </div>
    </Modal>
  );
};

export default EditChapterModal;
