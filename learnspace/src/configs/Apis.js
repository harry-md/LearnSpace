import axios from "axios";

export const endpoints = {
  categories: "/categories",
  courses: "/courses",
  register: "/users",
  login: "/login",
};

export default axios.create({
  baseURL: "http://localhost:8080/LearnSpaceBackend/api/",
});
