/**
 * teacherApi.js
 *
 * Tất cả hàm gọi API dành cho giáo viên đều nằm ở đây.
 * Mỗi hàm nhận `token` để xác thực, và trả về dữ liệu từ server.
 *
 * Cách dùng:
 *   import * as teacherApi from "@/services/teacherApi";
 *   const courses = await teacherApi.getCourses(token, userId);
 */

import Apis, { authApis, endpoints } from "@/configs/Apis";

// ─────────────────────────────────────────────
// KHÓA HỌC (Courses)
// ─────────────────────────────────────────────

/** Lấy danh sách khóa học của giáo viên */
export const getCourses = async (token, teacherId) => {
  const res = await authApis(token).get(
    `${endpoints.courses}?teacherId=${teacherId}`,
  );
  return res.data;
};

/** Tạo khóa học mới (cần FormData vì có upload ảnh/video) */
export const createCourse = async (token, formData) => {
  const res = await authApis(token).post(endpoints.courses, formData);
  return res.data;
};

/** Sửa thông tin khóa học (cần FormData vì có upload ảnh/video) */
export const updateCourse = async (token, courseId, formData) => {
  const res = await authApis(token).patch(
    `${endpoints.courses}/${courseId}`,
    formData,
  );
  return res.data;
};

/** Xóa khóa học */
export const deleteCourse = async (token, courseId) => {
  await authApis(token).delete(`${endpoints.courses}/${courseId}`);
};

/** Lấy danh sách danh mục (không cần token vì là public) */
export const getCategories = async () => {
  const res = await Apis.get(endpoints.categories);
  return res.data;
};

// ─────────────────────────────────────────────
// CHƯƠNG (Chapters)
// ─────────────────────────────────────────────

/** Lấy danh sách chương của một khóa học */
export const getChapters = async (token, courseId) => {
  const res = await authApis(token).get(
    `${endpoints.courses}/${courseId}/chapters`,
  );
  return res.data;
};

/** Tạo chương mới trong một khóa học */
export const createChapter = async (token, courseId, data) => {
  // Backend nhận: { name, order, free }
  const res = await authApis(token).post(
    `${endpoints.courses}/${courseId}/chapters`,
    data,
  );
  return res.data;
};

/** Sửa tên hoặc thứ tự chương */
export const updateChapter = async (token, chapterId, data) => {
  // Backend nhận: { name, order, free }
  const res = await authApis(token).patch(
    `${endpoints.chapters}/${chapterId}`,
    data,
  );
  return res.data;
};

/** Xóa chương */
export const deleteChapter = async (token, chapterId) => {
  await authApis(token).delete(`${endpoints.chapters}/${chapterId}`);
};

// ─────────────────────────────────────────────
// BÀI HỌC (Lessons)
// ─────────────────────────────────────────────

/** Lấy danh sách bài học trong một chương */
export const getLessons = async (token, chapterId) => {
  const res = await authApis(token).get(
    `${endpoints.chapters}/${chapterId}/lessons`,
  );
  return res.data;
};

/**
 * Tạo bài học mới (cần FormData vì có upload video bắt buộc)
 *
 * formData phải chứa:
 *   - "data": JSON blob với { title, content, order }
 *   - "video": File video .mp4
 */
export const createLesson = async (token, chapterId, formData) => {
  const res = await authApis(token).post(
    `${endpoints.chapters}/${chapterId}/lessons`,
    formData,
  );
  return res.data;
};

/**
 * Sửa bài học (cần FormData)
 *
 * formData có thể chứa:
 *   - "data": JSON blob với { title, content, order } (tùy chọn)
 *   - "video": File video mới (tùy chọn)
 */
export const updateLesson = async (token, lessonId, formData) => {
  const res = await authApis(token).patch(
    `${endpoints.lessons}/${lessonId}`,
    formData,
  );
  return res.data;
};

/** Xóa bài học */
export const deleteLesson = async (token, lessonId) => {
  await authApis(token).delete(`${endpoints.lessons}/${lessonId}`);
};
