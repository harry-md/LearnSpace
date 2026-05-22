import { useContext, useState } from "react";
import { UserContext } from "@/configs/Context";
import { useTeacherCourses } from "@/hooks/Teacher/useTeacherCourses";
import { useTeacherChapters } from "@/hooks/Teacher/useTeacherChapters";
import { useTeacherLessons } from "@/hooks/Teacher/useTeacherLessons";
import { authApis, endpoints } from "@/configs/Apis";

export const useTeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [modal, setModal] = useState(null);
  const [user] = useContext(UserContext);

  // Computed data (hardcoded for now to avoid nested queries)
  const totalSections = 12;
  const totalLessonsAll = 36;

  const loadSelectedCourseDetails = async (courseId) => {
    if (!user || !user.token) return;
    try {
      const chaptersRes = await authApis(user.token).get(
        `${endpoints.courses}/${courseId}/chapters`
      );
      const rawChapters = chaptersRes.data;

      const mappedChapters = await Promise.all(
        rawChapters.map(async (chapter) => {
          try {
            const lessonsRes = await authApis(user.token).get(
              `${endpoints.chapters}/${chapter.id}/lessons`
            );
            return {
              ...chapter,
              lessons: lessonsRes.data,
            };
          } catch (err) {
            console.error(`Lỗi fetch bài học cho chương ${chapter.id}:`, err);
            return {
              ...chapter,
              lessons: [],
            };
          }
        })
      );

      setSelectedCourse((prev) => {
        if (prev && prev.id === courseId) {
          return {
            ...prev,
            sections: mappedChapters,
          };
        }
        const base = courses.find((c) => c.id === courseId);
        if (base) {
          return {
            ...base,
            sections: mappedChapters,
          };
        }
        return prev;
      });
    } catch (err) {
      console.error("Lỗi khi tải chi tiết khóa học:", err);
    }
  };

  // Call the three sub-hooks
  const coursesHook = useTeacherCourses({
    user,
    selectedCourse,
    setSelectedCourse,
    setCourses,
    setModal,
  });

  const chaptersHook = useTeacherChapters({
    selectedCourse,
    setSelectedCourse,
    setCourses,
    setModal,
    loadCourse: coursesHook.loadCourse,
    loadSelectedCourseDetails,
  });

  const lessonsHook = useTeacherLessons({
    selectedCourse,
    setSelectedCourse,
    setCourses,
    setModal,
    loadCourse: coursesHook.loadCourse,
    loadSelectedCourseDetails,
  });

  const openManage = (course) => {
    setSelectedCourse(course);
    setOpenSections({});
    setView("manage");
    loadSelectedCourseDetails(course.id);
  };

  const toggleSection = (id) =>
    setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  // Computed editingCourse matching original logic
  const editingCourse =
    courses.find((c) => c.id === coursesHook.editingCourseId) || null;

  return {
    // Shared state
    courses,
    setCourses,
    view,
    setView,
    selectedCourse,
    setSelectedCourse,
    openSections,
    setOpenSections,
    modal,
    setModal,
    user,

    // Computed / aggregated
    totalSections,
    totalLessonsAll,
    editingCourse,

    // From useTeacherCourses
    categories: coursesHook.categories,
    loadCourse: coursesHook.loadCourse,
    loadCategories: coursesHook.loadCategories,
    handleDeleteCourse: coursesHook.handleDeleteCourse,
    togglePublish: coursesHook.togglePublish,
    openEditCourse: coursesHook.openEditCourse,
    onSuccessCreateCourse: coursesHook.onSuccessCreateCourse,
    onSuccessEditCourse: coursesHook.onSuccessEditCourse,

    // From useTeacherChapters
    editingChapter: chaptersHook.editingChapter,
    openAddChapter: chaptersHook.openAddChapter,
    handleAddChapter: chaptersHook.handleAddChapter,
    handleDeleteSection: chaptersHook.handleDeleteSection,
    openEditChapter: chaptersHook.openEditChapter,
    handleUpdateChapter: chaptersHook.handleUpdateChapter,
    handleMoveSection: chaptersHook.handleMoveSection,

    // From useTeacherLessons
    lessonTargetSectionId: lessonsHook.lessonTargetSectionId,
    editingLesson: lessonsHook.editingLesson,
    editingLessonSectionId: lessonsHook.editingLessonSectionId,
    openAddLesson: lessonsHook.openAddLesson,
    handleAddLesson: lessonsHook.handleAddLesson,
    handleDeleteLesson: lessonsHook.handleDeleteLesson,
    openEditLesson: lessonsHook.openEditLesson,
    handleUpdateLesson: lessonsHook.handleUpdateLesson,
    handleMoveLesson: lessonsHook.handleMoveLesson,

    // General Dashboard actions
    openManage,
    toggleSection,
    loadSelectedCourseDetails,
  };
};
