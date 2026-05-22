import React from "react";
import CreateCourseModal from "./Modals/CreateCourseModal";
import EditCourseModal from "./Modals/EditCourseModal";
import AddChapterModal from "./Modals/AddChapterModal";
import EditChapterModal from "./Modals/EditChapterModal";
import AddLessonModal from "./Modals/AddLessonModal";
import EditLessonModal from "./Modals/EditLessonModal";
import { useTeacherDashboardContext } from "../TeacherDashboardContext";

const DashboardModals = () => {
  const {
    categories,
    modal,
    setModal,
    user,
    onSuccessCreateCourse,
    editingCourse,
    onSuccessEditCourse,
    handleAddChapter,
    editingChapter,
    handleUpdateChapter,
    handleAddLesson,
    editingLesson,
    handleUpdateLesson,
  } = useTeacherDashboardContext();

  const onClose = () => setModal(null);

  return (
    <>
      <CreateCourseModal
        open={modal === "create-course"}
        onClose={onClose}
        categories={categories}
        user={user}
        onSuccess={onSuccessCreateCourse}
      />

      <EditCourseModal
        open={modal === "edit-course"}
        onClose={onClose}
        course={editingCourse}
        categories={categories}
        user={user}
        onSuccess={onSuccessEditCourse}
      />

      <AddChapterModal
        open={modal === "add-chapter"}
        onClose={onClose}
        onSubmit={handleAddChapter}
      />

      <EditChapterModal
        open={modal === "edit-chapter"}
        onClose={onClose}
        chapter={editingChapter}
        onSubmit={handleUpdateChapter}
      />

      <AddLessonModal
        open={modal === "add-lesson"}
        onClose={onClose}
        onSubmit={handleAddLesson}
      />

      <EditLessonModal
        open={modal === "edit-lesson"}
        onClose={onClose}
        lesson={editingLesson}
        onSubmit={handleUpdateLesson}
      />
    </>
  );
};

export default DashboardModals;
