import { useContext, useState } from "react";
import { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";

export const useTeacherLessons = ({
  selectedCourse,
  setSelectedCourse,
  setCourses,
  setModal,
  loadCourse,
  loadSelectedCourseDetails,
}) => {
  const [lessonTargetSectionId, setLessonTargetSectionId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingLessonSectionId, setEditingLessonSectionId] = useState(null);
  const [user] = useContext(UserContext);

  const updateReorderedSections = (newSections) => {
    if (!selectedCourse) return;
    setSelectedCourse((p) => ({ ...p, sections: newSections }));
  };

  const openAddLesson = (sectionId) => {
    setLessonTargetSectionId(sectionId);
    setModal("add-lesson");
  };

  const handleAddLesson = async (lessonData) => {
    if (!selectedCourse) return;
    try {
      await authApis(user.token).post(
        `${endpoints.chapters}/${lessonTargetSectionId}/lessons`,
        lessonData
      );
      await loadSelectedCourseDetails(selectedCourse.id);
      setModal(null);
    } catch (err) {
      console.error("Lỗi khi thêm bài học:", err);
    }
  };

  const handleDeleteLesson = async (sectionId, lessonId) => {
    if (!selectedCourse) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này không?")) return;
    try {
      await authApis(user.token).delete(`${endpoints.lessons}/${lessonId}`);
      await loadSelectedCourseDetails(selectedCourse.id);
    } catch (err) {
      console.error("Lỗi khi xóa bài học:", err);
    }
  };

  const openEditLesson = (sectionId, lesson) => {
    setEditingLesson(lesson);
    setEditingLessonSectionId(sectionId);
    setModal("edit-lesson");
  };

  const handleUpdateLesson = async (lessonData) => {
    if (!selectedCourse) return;
    try {
      await authApis(user.token).put(`${endpoints.lessons}/${editingLesson.id}`, lessonData);
      await loadSelectedCourseDetails(selectedCourse.id);
      setModal(null);
      setEditingLesson(null);
      setEditingLessonSectionId(null);
    } catch (err) {
      console.error("Lỗi khi sửa bài học:", err);
    }
  };

  const handleMoveLesson = (sectionId, lessonIndex, direction) => {
    if (!selectedCourse) return;
    const newSections = selectedCourse.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const newLessons = [...(s.lessons || [])];
      if (direction === "up") {
        if (lessonIndex === 0) return s;
        const temp = newLessons[lessonIndex];
        newLessons[lessonIndex] = newLessons[lessonIndex - 1];
        newLessons[lessonIndex - 1] = temp;
      } else if (direction === "down") {
        if (lessonIndex === newLessons.length - 1) return s;
        const temp = newLessons[lessonIndex];
        newLessons[lessonIndex] = newLessons[lessonIndex + 1];
        newLessons[lessonIndex + 1] = temp;
      }
      return { ...s, lessons: newLessons };
    });
    updateReorderedSections(newSections);
  };

  return {
    lessonTargetSectionId,
    setLessonTargetSectionId,
    editingLesson,
    setEditingLesson,
    editingLessonSectionId,
    setEditingLessonSectionId,
    openAddLesson,
    handleAddLesson,
    handleDeleteLesson,
    openEditLesson,
    handleUpdateLesson,
    handleMoveLesson,
  };
};
