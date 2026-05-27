import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal, Field, inputCls, inputStyle } from "../UIComponent";
import { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";

const EditCourseModal = ({ open, onClose, course, categories, onSuccess }) => {
  const [user] = useContext(UserContext);
  const [editCourseForm, setEditCourseForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    imageFile: null,
    introVideoFile: null,
  });

  const imageRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (course) {
      setEditCourseForm({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        imageFile: null,
        introVideoFile: null,
      });
    }
  }, [course]);

  const handleUpdateCourse = async () => {
    const hasUpdates =
      editCourseForm.name.trim() ||
      editCourseForm.description.trim() ||
      editCourseForm.categoryId ||
      editCourseForm.price !== "" ||
      editCourseForm.imageFile instanceof File ||
      editCourseForm.introVideoFile instanceof File;

    if (!hasUpdates) {
      onClose();
      return;
    }

    try {
      const formData = new FormData();
      if (editCourseForm.name.trim()) {
        formData.append("name", editCourseForm.name);
      }
      if (editCourseForm.description.trim()) {
        formData.append("description", editCourseForm.description);
      }
      if (editCourseForm.categoryId) {
        formData.append("categoryId", editCourseForm.categoryId);
      }
      if (editCourseForm.price !== "") {
        formData.append("price", editCourseForm.price);
      }
      if (editCourseForm.imageFile instanceof File) {
        formData.append("imageFile", editCourseForm.imageFile);
      }
      if (editCourseForm.introVideoFile instanceof File) {
        formData.append("introVideoFile", editCourseForm.introVideoFile);
      }

      const res = await authApis(user.token).patch(
        `${endpoints.courses}/${course.id}`,
        formData,
      );

      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật khóa học:", err.message);
      alert(
        `Cập nhật khóa học thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chỉnh sửa thông tin khóa học"
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
          placeholder={
            course?.name || course?.title || "VD: Python từ cơ bản đến nâng cao"
          }
          value={editCourseForm.name}
          onChange={(e) =>
            setEditCourseForm({ ...editCourseForm, name: e.target.value })
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
          placeholder={course?.description || "Mô tả tổng quan về khóa học..."}
          value={editCourseForm.description}
          onChange={(e) =>
            setEditCourseForm({
              ...editCourseForm,
              description: e.target.value,
            })
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
            value={editCourseForm.categoryId || course?.categoryId || 1}
            onChange={(e) =>
              setEditCourseForm({
                ...editCourseForm,
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
            placeholder={
              course?.price !== undefined ? String(course.price) : "VD: 499000"
            }
            type="number"
            value={editCourseForm.price}
            onChange={(e) =>
              setEditCourseForm({ ...editCourseForm, price: e.target.value })
            }
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </Field>
      </div>

      {/* Upload ảnh bìa và video giới thiệu */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <Field label="Đổi ảnh bìa" hint="Để trống nếu không muốn thay">
          <div
            onClick={() => imageRef.current.click()}
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
            }}
          >
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setEditCourseForm({
                  ...editCourseForm,
                  imageFile: e.target.files[0],
                })
              }
            />
            <span
              style={{
                fontSize: "12px",
                color:
                  editCourseForm.image instanceof File ? "#059669" : "#6b7280",
                fontWeight: 600,
              }}
            >
              {editCourseForm.image instanceof File
                ? `✓ ${editCourseForm.image.name}`
                : "Click để upload ảnh mới"}
            </span>
          </div>
        </Field>
        <Field label="Đổi video giới thiệu" hint="Để trống nếu không muốn thay">
          <div
            onClick={() => videoRef.current.click()}
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
            }}
          >
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4"
              style={{ display: "none" }}
              onChange={(e) =>
                setEditCourseForm({
                  ...editCourseForm,
                  introVideoFile: e.target.files[0],
                })
              }
            />
            <span
              style={{
                fontSize: "12px",
                color:
                  editCourseForm.introVideo instanceof File
                    ? "#059669"
                    : "#6b7280",
                fontWeight: 600,
              }}
            >
              {editCourseForm.introVideo instanceof File
                ? `✓ ${editCourseForm.introVideo.name}`
                : "Click để upload video .mp4 mới"}
            </span>
          </div>
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
          onClick={handleUpdateCourse}
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
          Lưu thay đổi
        </button>
      </div>
    </Modal>
  );
};

export default EditCourseModal;
