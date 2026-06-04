import React, { useState, useEffect, useContext } from "react";
import { Image, Video, PlusCircle } from "lucide-react";
import { Modal } from "../../UIComponent/Modal";
import { Field } from "../../UIComponent/Field";
import "../../UIComponent/style.css";
import "./CreateCourseModal.css";
import { authApis, endpoints } from "@/configs/Apis";
import { UserContext, UIContext } from "@/configs/Context";

const CreateCourseModal = ({ open, onClose, categories, onSuccess }) => {
  const [user] = useContext(UserContext);
  const [_, uiDispatch] = useContext(UIContext);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    categoryId: 1,
    price: "",
    image: null,
    introVideo: null,
  });

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCourseForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories]);

  const handleCreateCourse = async () => {
    if (!courseForm.name.trim()) return;

    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const formData = new FormData();
      formData.append("name", courseForm.name);
      formData.append("description", courseForm.description);
      formData.append("categoryId", courseForm.categoryId);
      formData.append("price", courseForm.price || 0);
      formData.append("active", false);

      if (courseForm.image) {
        formData.append("imageFile", courseForm.image);
      }
      if (courseForm.introVideo) {
        formData.append("introVideoFile", courseForm.introVideo);
      }

      const res = await authApis(user.token).post(endpoints.courses, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess(res.data);
      setCourseForm({
        name: "",
        description: "",
        categoryId: categories[0]?.id || 1,
        price: "",
        image: null,
        introVideo: null,
      });
      onClose();
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Tạo khóa học thành công!",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Lỗi tạo khóa học:", err.message);
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Lỗi tạo khóa học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Tạo khóa học mới" wide>
      <Field label="Tên khóa học" required>
        <input
          className="input-cls"
          placeholder="Tên khóa học"
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
          className="input-cls create-course-textarea"
          rows={3}
          placeholder="Mô tả tổng quan về khóa học"
          value={courseForm.description}
          onChange={(e) =>
            setCourseForm({ ...courseForm, description: e.target.value })
          }
          onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      </Field>
      <div className="create-course-grid">
        <Field label="Danh mục">
          <select
            className="input-cls create-course-select"
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
        <Field label="Giá">
          <input
            className="input-cls"
            placeholder=""
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
      <div className="create-course-grid">
        <Field label="Ảnh bìa khóa học">
          <label className="create-course-file-label">
            <input
              type="file"
              accept="image/*"
              className="create-course-file-input"
              onChange={(e) =>
                setCourseForm({ ...courseForm, image: e.target.files[0] })
              }
            />
            <div className="create-course-icon-image">
              <Image size={20} />
            </div>
            <span className="create-course-file-text">
              {courseForm.image ? courseForm.image.name : "Click để upload ảnh"}
            </span>
          </label>
        </Field>
        <Field label="Video giới thiệu">
          <label className="create-course-file-label">
            <input
              type="file"
              accept="video/mp4"
              className="create-course-file-input"
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  introVideo: e.target.files[0],
                })
              }
            />
            <div className="create-course-icon-video">
              <Video size={20} />
            </div>
            <span className="create-course-file-text">
              {courseForm.introVideo
                ? courseForm.introVideo.name
                : "Click chọn file .mp4"}
            </span>
          </label>
        </Field>
      </div>
      <div className="create-course-footer">
        <button onClick={onClose} className="create-course-btn-cancel">
          Hủy bỏ
        </button>
        <button
          onClick={handleCreateCourse}
          className="create-course-btn-submit"
        >
          <PlusCircle size={16} />
          Tạo khóa học
        </button>
      </div>
    </Modal>
  );
};

export default CreateCourseModal;
