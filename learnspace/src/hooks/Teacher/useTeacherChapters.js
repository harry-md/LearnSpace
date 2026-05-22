import { useContext, useState } from "react";
import { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";

export const useTeacherChapters = ({
  selectedCourse,
  setSelectedCourse,
  setModal,
  loadSelectedCourseDetails,
}) => {
  const [editingChapter, setEditingChapter] = useState(null);
  const [user] = useContext(UserContext);

  const updateReorderedSections = (newSections) => {
    if (!selectedCourse) return;
    setSelectedCourse((p) => ({ ...p, sections: newSections }));
  };

  const openAddChapter = () => {
    setModal("add-chapter");
  };

  const handleAddChapter = async ({ title }) => {
    try {
      await authApis(user.token).post(
        `${endpoints.courses}/${selectedCourse.id}/chapters`,
        {
          name: title,
          order: selectedCourse.sections.length,
        },
      );
      await loadSelectedCourseDetails(selectedCourse.id);
      setModal(null);
    } catch (err) {
      console.error("Lỗi khi thêm chương:", err);
    }
  };

  const handleDeleteSection = async (courseId, sectionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này không?")) return;
    try {
      await authApis(user.token).delete(`${endpoints.chapters}/${sectionId}`);
      await loadSelectedCourseDetails(courseId);
    } catch (err) {
      console.error("Lỗi khi xóa chương:", err);
    }
  };

  const openEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setModal("edit-chapter");
  };

  const handleUpdateChapter = async ({ title }) => {
    try {
      await authApis(user.token).patch(
        `${endpoints.chapters}/${editingChapter.id}`,
        {
          name: title,
          order: editingChapter.order,
        },
      );
      await loadSelectedCourseDetails(selectedCourse.id);
      setModal(null);
      setEditingChapter(null);
    } catch (err) {
      console.error("Lỗi khi sửa chương:", err);
    }
  };

  const handleMoveSection = (index, direction) => {
    if (!selectedCourse) return;
    const newSections = [...selectedCourse.sections];
    if (direction === "up") {
      if (index === 0) return;
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
    } else if (direction === "down") {
      if (index === newSections.length - 1) return;
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
    }
    updateReorderedSections(newSections);
  };

  return {
    editingChapter,
    setEditingChapter,
    openAddChapter,
    handleAddChapter,
    handleDeleteSection,
    openEditChapter,
    handleUpdateChapter,
    handleMoveSection,
  };
};
