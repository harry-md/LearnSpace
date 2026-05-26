import { useState, useContext } from "react";
import { UserContext } from "@/configs/Context";
import { authApis, endpoints } from "@/configs/Apis";

const useTeacherDashBoard = () => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [user] = useContext(UserContext);

  const handleUpdateCourseStatus = async (courseId, status) => {
    try {
      await authApis(user.token).patch(`${endpoints.courses}/${courseId}`, {
        active: status,
      });
      setTeacherCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, active: status } : course,
        ),
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
    handleLoadCourseOfTeacher,
    handleUpdateCourseStatus,
  };
};

export default useTeacherDashBoard;
