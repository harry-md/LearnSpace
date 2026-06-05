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
    free: false,
  });

  useEffect(() => {
    if (open) {
      setChapterForm({ title: "", description: "", free: false });
    }
  }, [open]);

  const handleAdd = () => {
    if (!chapterForm.title.trim()) return;
    onSubmit({
      title: chapterForm.title,
      description: chapterForm.description,
      free: chapterForm.free,
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
      <div className="flex items-center gap-3 mt-2 mb-4">
        <span className="text-[14px] font-medium text-gray-700">
          Cho phép học thử (Miễn phí)
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={chapterForm.free}
            onChange={(e) =>
              setChapterForm({ ...chapterForm, free: e.target.checked })
            }
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>
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
