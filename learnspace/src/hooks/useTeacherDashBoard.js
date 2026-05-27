import { useState, useContext } from "react";
import { UIContext, UserContext } from "@/configs/Context";
import Apis, { authApis, endpoints } from "@/configs/Apis";

const useTeacherDashBoard = () => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user] = useContext(UserContext);
  const [_, uiDispatch] = useContext(UIContext);

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
    try {
      await authApis(user.token).delete(`${endpoints.courses}/${courseId}`);
      setTeacherCourses((prev) =>
        prev.filter((course) => course.id !== courseId),
      );
      console.log("Xóa thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadCategories = () => {
    try {
      const res = Apis.get(endpoints.categories);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateCourse = async (courseId, formData) => {
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
      console.log("Thay đổi thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadCourseOfTeacher = async () => {
    try {
      if (!user || !user.token) {
        return;
      }
      const res = await authApis(user.token).get(
        `${endpoints.courses}?teacherId=${user.id}`,
      );

      if (Array.isArray(res.data)) {
        const courses = res.data;

        const coursesWithFullDetails = await Promise.all(
          courses.map(async (course) => {
            try {
              const chapterRes = await authApis(user.token).get(
                endpoints.course_chapter(course.id),
              );
              const chaptersList = chapterRes.data || [];
              const chaptersWithLessons = await Promise.all(
                chaptersList.map(async (chapter) => {
                  try {
                    const lessonRes = await authApis(user.token).get(
                      endpoints.chapter_lesson(chapter.id),
                    );
                    return { ...chapter, lessons: lessonRes.data || [] };
                  } catch (err) {
                    console.error(
                      `Lỗi tải lessons của chapter ${chapter.id}:`,
                      err,
                    );
                    return { ...chapter, lessons: [] };
                  }
                }),
              );

              return { ...course, chapters: chaptersWithLessons };
            } catch (err) {
              console.error(`Lỗi tải chapters của course ${course.id}:`, err);
              return { ...course, chapters: [] };
            }
          }),
        );
        console.log("coursesWithFullDetails", coursesWithFullDetails);
        setTeacherCourses(coursesWithFullDetails);
      }
    } catch (error) {
      console.error(error);
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
    handleCreateLesson,
  };
};

export default useTeacherDashBoard;
