import axios from "axios";

export const endpoints = {
  categories: "/categories",
  courses: "/courses",
  chapters: "/chapters",
  add_chapter: (courseId) => `/courses/${courseId}/chapters`,
  chapter_lesson: (chapterId) => `/chapters/${chapterId}/lessons`,
  course_chapter: (courseId) => `/courses/${courseId}/chapters`,
  lessons: "/lessons",
  register: "/users",
  login: "/login",
  current_user: "/current-user",
  enrolled_courses: "/enrollments/my-courses",
  course_progress: (courseId) => `/courses/${courseId}/progress`,
};

export const authApis = (token) => {
  return axios.create({
    baseURL: "http://localhost:8080/LearnSpaceBackend/api/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: "http://localhost:8080/LearnSpaceBackend/api/",
});
