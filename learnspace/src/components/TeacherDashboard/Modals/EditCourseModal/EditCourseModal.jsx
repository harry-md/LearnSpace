import React, { useState, useEffect, useRef, useContext } from "react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./EditCourseModal.css";
import { authApis, endpoints } from "@/configs/Apis";
import { UIContext, UserContext } from "@/configs/Context";

const EditCourseModal = ({ open, onClose, course, categories, onSuccess }) => {
  const [user] = useContext(UserContext);
  const [, uiDispatch] = useContext(UIContext);
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
      uiDispatch({ type: "SHOW_LOADING" });

      const res = await authApis(user.token).patch(
        `${endpoints.courses}/${course.id}`,
        formData,
      );

      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Cập nhật khóa học thành công!",
          type: "success",
        },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          show: true,
          title: "Lỗi",
          message: "Cập nhật khóa học thất bại!",
          actions: [
            {
              label: "Đóng",
              onClick: () => uiDispatch({ type: "HIDE_DIALOG" }),
            },
          ],
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chỉnh sửa thông tin khóa học"
      wide
    >
      <Field label="Tên khóa học" required hint="">
        <input
          className="input-cls"
          placeholder={course?.name || course?.title || "Tiêu đề"}
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
          className="input-cls edit-course-textarea"
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
      <div className="edit-course-grid">
        <Field label="Danh mục">
          <select
            className="input-cls edit-course-select"
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
        <Field label="Giá">
          <input
            className="input-cls"
            placeholder={
              course?.price !== undefined ? String(course.price) : ""
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

      <div className="edit-course-grid">
        <Field label="Đổi ảnh bìa" hint="Để trống nếu không muốn thay">
          <div
            onClick={() => imageRef.current.click()}
            className="edit-course-file-label"
          >
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="edit-course-file-input"
              onChange={(e) =>
                setEditCourseForm({
                  ...editCourseForm,
                  imageFile: e.target.files[0],
                })
              }
            />
            <span
              className="edit-course-file-text"
              style={{
                color:
                  editCourseForm.image instanceof File ? "#059669" : "#6b7280",
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
            className="edit-course-file-label"
          >
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4"
              className="edit-course-file-input"
              onChange={(e) =>
                setEditCourseForm({
                  ...editCourseForm,
                  introVideoFile: e.target.files[0],
                })
              }
            />
            <span
              className="edit-course-file-text"
              style={{
                color:
                  editCourseForm.introVideo instanceof File
                    ? "#059669"
                    : "#6b7280",
              }}
            >
              {editCourseForm.introVideo instanceof File
                ? `${editCourseForm.introVideo.name}`
                : "Click để upload video .mp4 mới"}
            </span>
          </div>
        </Field>
      </div>

      <div className="edit-course-footer">
        <button onClick={onClose} className="edit-course-btn-cancel">
          Hủy bỏ
        </button>
        <button onClick={handleUpdateCourse} className="edit-course-btn-submit">
          Lưu thay đổi
        </button>
      </div>
    </Modal>
  );
};

export default EditCourseModal;
