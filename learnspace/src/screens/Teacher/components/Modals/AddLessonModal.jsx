import React, { useState, useEffect } from "react";
import { PlusCircle, Video } from "lucide-react";
import { Modal, Field, inputCls, inputStyle } from "../UIComponent";

const AddLessonModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoFile: null,
  });

  // Reset form mỗi khi modal mở
  useEffect(() => {
    if (open) {
      setForm({ title: "", content: "", videoFile: null });
    }
  }, [open]);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    if (!form.videoFile) {
      alert("Vui lòng chọn file video cho bài học.");
      return;
    }
    onSubmit(form); // gửi toàn bộ form lên hook xử lý
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo bài học mới">
      {/* Tiêu đề bài học */}
      <Field label="Tiêu đề bài học" required>
        <input
          className={inputCls}
          style={inputStyle}
          placeholder="VD: Two Sum – Bài kinh điển LeetCode"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      {/* Mô tả / nội dung (tùy chọn) */}
      <Field label="Mô tả bài học">
        <textarea
          className={inputCls}
          style={{ ...inputStyle, resize: "none" }}
          rows={3}
          placeholder="Tóm tắt nội dung bài học..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>

      {/* Upload file video – bắt buộc */}
      <Field label="File video bài học" required hint="Chỉ chấp nhận file .mp4">
        <label
          style={{
            border: `2px dashed ${form.videoFile ? "#10b981" : "#e5e7eb"}`,
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            background: form.videoFile ? "rgba(16,185,129,0.04)" : "#fafafa",
            transition: "all 0.15s",
          }}
        >
          <input
            type="file"
            accept="video/mp4"
            style={{ display: "none" }}
            onChange={(e) => setForm({ ...form, videoFile: e.target.files[0] })}
          />
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: form.videoFile ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video size={20} style={{ color: form.videoFile ? "#10b981" : "#8b5cf6" }} />
          </div>
          <span style={{ fontSize: "12px", color: form.videoFile ? "#059669" : "#6b7280", fontWeight: 600 }}>
            {form.videoFile ? `✓ ${form.videoFile.name}` : "Click để chọn file .mp4"}
          </span>
        </label>
      </Field>

      {/* Nút hành động */}
      <div style={{ display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f3f4f6", marginTop: "8px" }}>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: "12px", border: "1px solid #e5e7eb", color: "#6b7280", fontWeight: 700, borderRadius: "10px", cursor: "pointer", background: "white", fontSize: "14px" }}
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleAdd}
          style={{ flex: 1, padding: "12px", background: "#5624d0", color: "white", fontWeight: 700, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <PlusCircle size={16} />
          Tạo bài học
        </button>
      </div>
    </Modal>
  );
};

export default AddLessonModal;
