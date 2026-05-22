import axios from "axios";

export const endpoints = {
  categories: "/categories",
  courses: "/courses",
  chapters: "/chapters",
  lessons: "/lessons",
  register: "/users",
  login: "/login",
  current_user: "/current-user",
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
