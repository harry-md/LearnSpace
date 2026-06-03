import axios from "axios";

export const endpoints = {
  categories: "/categories",
  courses: "/courses",
  courseDetails: (courseId) => `/courses/${courseId}`,
  chapters: "/chapters",
  addChapter: (courseId) => `/courses/${courseId}/chapters`,
  chapterLesson: (chapterId) => `/chapters/${chapterId}/lessons`,
  courseChapter: (courseId) => `/courses/${courseId}/chapters`,
  lessons: "/lessons",
  addLesson: (chapterId) => `/chapters/${chapterId}/lessons`,
  register: "/users",
  login: "/login",
  currentUser: "/current-user",
  enrolledCourses: "/courses/my-courses",
  enrollFreeCourse: (courseId) => `/courses/${courseId}/enrollments`,
  courseProgress: (courseId) => `/courses/${courseId}/progress`,
  lessonProgress: (lessonId) => `/lessons/${lessonId}/lesson-progress`,
  checkout: "/payments/checkout",
  capturePayment: (token) => `/payments/${token}/capture`,
  chatToken: "/chat/token",
  chatContacts: "/chat/contacts",
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
