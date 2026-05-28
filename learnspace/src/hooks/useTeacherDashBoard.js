import { useState, useContext } from "react";
import { UIContext, UserContext } from "@/configs/Context";
import Apis, { authApis, endpoints } from "@/configs/Apis";

const useTeacherDashBoard = () => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user] = useContext(UserContext);
  const [_, uiDispatch] = useContext(UIContext);

  const handleDeleteLesson = async (lessonId) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      await authApis(user.token).delete(`${endpoints.lessons}/${lessonId}`);
      setTeacherCourses((prev) =>
        prev.map((course) => ({
          ...course,
          chapters: (course.chapters || []).map((chapter) => ({
            ...chapter,
            lessons: (chapter.lessons || []).filter(
              (lesson) => lesson.id !== lessonId,
            ),
          })),
        })),
      );
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Xóa bài học thành công!",
          type: "success",
        },
      });
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Không thể xóa bài học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };
  const handleUpdateLesson = async (lessonId, formData) => {
    try {
      uiDispatch({ type: "SHOW_LOADING" });
      const res = await authApis(user.token).patch(
        `${endpoints.lessons}/${lessonId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.status === 200) {
        const updatedLesson = res.data;
        setTeacherCourses((prev) =>
          prev.map((course) => ({
            ...course,
            chapters: (course.chapters || []).map((chapter) => ({
              ...chapter,
              lessons: (chapter.lessons || []).map((lesson) =>
                lesson.id === lessonId ? updatedLesson : lesson,
              ),
            })),
          })),
        );
        uiDispatch({
          type: "SHOW_DIALOG",
          payload: {
            title: "Thành công",
            message: "Cập nhật bài học thành công!",
            type: "success",
          },
        });
        return updatedLesson;
      }
    } catch (err) {
      uiDispatch({ type: "HIDE_LOADING" });
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || err.message,
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleCreateLesson = async (chapterId, formData) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await authApis(user.token).post(
        endpoints.add_lesson(chapterId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.status === 201) {
        const newLesson = res.data;
        setTeacherCourses((prev) =>
          prev.map((c) => ({
            ...c,
            chapters: (c.chapters || []).map((ch) => {
              if (ch.id === chapterId) {
                return {
                  ...ch,
                  lessons: [...(ch.lessons || []), newLesson],
                };
              }
              return ch;
            }),
          })),
        );
        console.log("Thêm bài học thành công!");
        return newLesson;
      }
    } catch (err) {
      uiDispatch({ type: "HIDE_LOADING" });
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || err.message,
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      await authApis(user.token).delete(`${endpoints.chapters}/${chapterId}`);
      setTeacherCourses((prev) =>
        prev.map((course) => ({
          ...course,
          chapters: (course.chapters || []).filter((ch) => ch.id !== chapterId),
        })),
      );
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Xóa chương thành công!",
          type: "success",
        },
      });
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Không thể xóa chương",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleCreateChapter = async (courseId, chapterData) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await authApis(user.token).post(
        endpoints.add_chapter(courseId),
        chapterData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const newChapter = res.data;

      setTeacherCourses((prev) =>
        prev.map((c) => {
          if (c.id === courseId) {
            return {
              ...c,
              chapters: [...(c.chapters || []), { ...newChapter, lessons: [] }],
            };
          }
          return c;
        }),
      );
      console.log("Thêm chương mới thành công!");
      return newChapter;
    } catch (err) {
      uiDispatch({ type: "HIDE_LOADING" });
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || err.message,
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      await authApis(user.token).delete(`${endpoints.courses}/${courseId}`);
      setTeacherCourses((prev) =>
        prev.filter((course) => course.id !== courseId),
      );
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Xóa khóa học thành công!",
          type: "success",
        },
      });
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Không thể xóa khóa học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleLoadCategories = async () => {
    try {
      const res = await Apis.get(endpoints.categories);
      setCategories(res.data);
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Không thể tải danh mục",
          type: "error",
        },
      });
    }
  };

  const handleUpdateCourse = async (courseId, formData) => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await authApis(user.token).patch(
        `${endpoints.courses}/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const activeVal = formData.get("active");
      const updatedData = res.data || {};

      setTeacherCourses((prev) =>
        prev.map((course) => {
          if (course.id === courseId) {
            const nextActive =
              activeVal !== null
                ? activeVal === "true" || activeVal === true
                : course.active;
            return {
              ...course,
              ...updatedData,
              active: nextActive,
            };
          }
          return course;
        }),
      );
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thành công",
          message: "Cập nhật khóa học thành công!",
          type: "success",
        },
      });
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Lỗi cập nhật khóa học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const handleLoadCourseOfTeacher = async () => {
    try {
      if (!user || !user.token) {
        return;
      }
      uiDispatch({ type: "SHOW_LOADING" });
      const res = await authApis(user.token).get(
        `${endpoints.courses}?teacherId=${user.id}`,
      );

      setTeacherCourses(res.data);
    } catch (error) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message:
            error.response?.data?.message || "Lỗi tải danh sách khóa học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  return {
    teacherCourses,
    setTeacherCourses,
    categories,
    user,
    handleLoadCourseOfTeacher,
    handleUpdateCourse,
    handleLoadCategories,
    handleDeleteCourse,
    handleCreateChapter,
    handleDeleteChapter,
    handleCreateLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  };
};

export default useTeacherDashBoard;
