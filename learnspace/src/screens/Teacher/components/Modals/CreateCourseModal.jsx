import React, { useState, useEffect } from "react";
import { Image, Video, PlusCircle } from "lucide-react";
import { Modal, Field, inputCls, inputStyle } from "../UIComponent";
import { authApis, endpoints } from "@/configs/Apis";
import { toast } from "@heroui/react";

const CreateCourseModal = ({ open, onClose, categories, user, onSuccess }) => {
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    categoryId: 1,
    price: "",
    image: null,
    introVideo: null,
  });

  // Set default category when categories load
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCourseForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories]);

  const handleCreateCourse = () => {
    if (!courseForm.name.trim()) return;

    const createPromise = async () => {
      const formData = new FormData();
      formData.append("name", courseForm.name);
      formData.append("description", courseForm.description);
      formData.append("categoryId", courseForm.categoryId);
      formData.append("price", courseForm.price || 0);
      formData.append("active", false);

      if (courseForm.image) {
        formData.append("image", courseForm.image);
      }
      if (courseForm.introVideo) {
        formData.append("introVideo", courseForm.introVideo);
      }

      const res = await authApis(user.token).post(endpoints.courses, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    };

    toast.promise(createPromise(), {
      loading: "Đang tạo khóa học...",
      success: (data) => {
        onSuccess(data);
        setCourseForm({
          name: "",
          description: "",
          categoryId: categories[0]?.id || 1,
          price: "",
          image: null,
          introVideo: null,
        });
        onClose();
        return `Khóa học ${data.name || courseForm.name} đã được tạo thành công!`;
      },
      error: (err) => {
        console.error("Lỗi tạo khóa học:", err.message);
        return `Tạo khóa học thất bại: ${err.response?.data?.message || err.message}`;
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo khóa học mới" wide>
      <Field
        label="Tên khóa học"
        required
        hint="Hãy dùng tiêu đề rõ ràng, hấp dẫn để thu hút học viên"
      >
        <input
          className={inputCls}
          style={inputStyle}
          placeholder="VD: Python từ cơ bản đến nâng cao"
          value={courseForm.name}
          onChange={(e) =>
            setCourseForm({ ...courseForm, name: e.target.value })
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
            value={courseForm.categoryId}
            onChange={(e) =>
              setCourseForm({
                ...courseForm,
                categoryId: parseInt(e.target.value),
              })
            }
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Giá (VND)">
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="VD: 499000"
            type="number"
            value={courseForm.price}
            onChange={(e) =>
              setCourseForm({ ...courseForm, price: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <Field label="Ảnh bìa khóa học">
          <label
            style={{
              border: "2px dashed #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 0.15s",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setCourseForm({ ...courseForm, image: e.target.files[0] })
              }
            />
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(139,92,246,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image size={20} style={{ color: "#8b5cf6" }} />
            </div>
            <span
              style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}
            >
              {courseForm.image
                ? courseForm.image.name
                : "Click để upload ảnh"}
            </span>
          </label>
        </Field>
        <Field label="Video giới thiệu">
          <label
            style={{
              border: "2px dashed #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              background: "#fafafa",
              transition: "all 0.15s",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              accept="video/mp4"
              style={{ display: "none" }}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  introVideo: e.target.files[0],
                })
              }
            />
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Video size={20} style={{ color: "#10b981" }} />
            </div>
            <span
              style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}
            >
              {courseForm.introVideo
                ? courseForm.introVideo.name
                : "Click chọn file .mp4"}
            </span>
          </label>
        </Field>
      </div>
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
  );
};

export default CreateCourseModal;
