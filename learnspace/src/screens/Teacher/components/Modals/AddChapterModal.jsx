import React, { useState, useEffect } from "react";
import { FolderPlus } from "lucide-react";
import { Modal, Field, inputCls, inputStyle } from "../UIComponent";

const AddChapterModal = ({ open, onClose, onSubmit }) => {
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
          <FolderPlus size={16} />
          Thêm vào khóa học
        </button>
      </div>
    </Modal>
  );
};

export default AddChapterModal;
