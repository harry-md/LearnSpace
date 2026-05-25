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
    // Dữ liệu cần thiết cho các modal
    user,
    categories,
    editingCourse,
    editingChapter,
    editingLesson,

    // Điều khiển modal
    modal,
    setModal,

    // Callbacks sau khi form submit thành công
    onCourseCreated,
    onCourseUpdated,
    handleAddChapter,
    handleUpdateChapter,
    handleAddLesson,
    handleUpdateLesson,
  } = useTeacherDashboardContext();

  const onClose = () => setModal(null);

  return (
    <>
      {/* Tạo khóa học mới */}
      <CreateCourseModal
        open={modal === "create-course"}
        onClose={onClose}
        categories={categories}
        user={user}
        onSuccess={onCourseCreated}
      />

      {/* Sửa khóa học */}
      <EditCourseModal
        open={modal === "edit-course"}
        onClose={onClose}
        course={editingCourse}
        categories={categories}
        user={user}
        onSuccess={onCourseUpdated}
      />

      {/* Thêm chương */}
      <AddChapterModal
        open={modal === "add-chapter"}
        onClose={onClose}
        onSubmit={handleAddChapter}
      />

      {/* Sửa chương */}
      <EditChapterModal
        open={modal === "edit-chapter"}
        onClose={onClose}
        chapter={editingChapter}
        onSubmit={handleUpdateChapter}
      />

      {/* Thêm bài học */}
      <AddLessonModal
        open={modal === "add-lesson"}
        onClose={onClose}
        onSubmit={handleAddLesson}
      />

      {/* Sửa bài học */}
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
