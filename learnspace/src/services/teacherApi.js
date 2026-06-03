import Apis, { authApis, endpoints } from "@/configs/Apis";

export const getCourses = async (token, teacherId) => {
  const res = await authApis(token).get(
    `${endpoints.courses}?teacherId=${teacherId}`,
  );
  return res.data;
};

export const createCourse = async (token, formData) => {
  const res = await authApis(token).post(endpoints.courses, formData);
  return res.data;
};

export const updateCourse = async (token, courseId, formData) => {
  const res = await authApis(token).patch(
    `${endpoints.courses}/${courseId}`,
    formData,
  );
  return res.data;
};

export const deleteCourse = async (token, courseId) => {
  await authApis(token).delete(`${endpoints.courses}/${courseId}`);
};

export const getCategories = async () => {
  const res = await Apis.get(endpoints.categories);
  return res.data;
};

export const getChapters = async (token, courseId) => {
  const res = await authApis(token).get(
    `${endpoints.courses}/${courseId}/chapters`,
  );
  return res.data;
};

export const createChapter = async (token, courseId, data) => {
  const res = await authApis(token).post(
    `${endpoints.courses}/${courseId}/chapters`,
    data,
  );
  return res.data;
};

export const updateChapter = async (token, chapterId, data) => {
  const res = await authApis(token).patch(
    `${endpoints.chapters}/${chapterId}`,
    data,
  );
  return res.data;
};

export const deleteChapter = async (token, chapterId) => {
  await authApis(token).delete(`${endpoints.chapters}/${chapterId}`);
};

export const getLessons = async (token, chapterId) => {
  const res = await authApis(token).get(
    `${endpoints.chapters}/${chapterId}/lessons`,
  );
  return res.data;
};

export const createLesson = async (token, chapterId, formData) => {
  const res = await authApis(token).post(
    `${endpoints.chapters}/${chapterId}/lessons`,
    formData,
  );
  return res.data;
};

export const updateLesson = async (token, lessonId, formData) => {
  const res = await authApis(token).patch(
    `${endpoints.lessons}/${lessonId}`,
    formData,
  );
  return res.data;
};

export const deleteLesson = async (token, lessonId) => {
  await authApis(token).delete(`${endpoints.lessons}/${lessonId}`);
};
