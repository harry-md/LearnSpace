/**
 * useTeacherDashboard.js
 *
 * Hook duy nhất quản lý toàn bộ state và hành động cho trang Teacher Dashboard.
 *
 * Cấu trúc:
 *   1. STATE         – các biến lưu trữ dữ liệu
 *   2. HELPERS       – hàm tải lại dữ liệu từ server
 *   3. COURSES       – thêm / sửa / xóa khóa học
 *   4. CHAPTERS      – thêm / sửa / xóa chương
 *   5. LESSONS       – thêm / sửa / xóa bài học
 *   6. UI            – điều hướng view, mở modal, toggle section
 */

import { useContext, useEffect, useState } from "react";
import { useContext as useCtx } from "react";
import { UserContext } from "@/configs/Context";
import { toast } from "@heroui/react";
import * as teacherApi from "@/services/teacherApi";

export const useTeacherDashboard = () => {
  // ─── 1. STATE ─────────────────────────────────────────────────────────────

  const [user] = useContext(UserContext);

  // Danh sách tất cả khóa học của giáo viên
  const [courses, setCourses] = useState([]);

  // Danh sách danh mục (dùng khi tạo / sửa khóa học)
  const [categories, setCategories] = useState([]);

  // Khóa học đang được quản lý (có đầy đủ chương + bài học)
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Chương đang mở để chỉnh sửa
  const [editingChapter, setEditingChapter] = useState(null);

  // Bài học đang mở để chỉnh sửa
  const [editingLesson, setEditingLesson] = useState(null);

  // ID chương đang thêm bài học vào
  const [targetChapterId, setTargetChapterId] = useState(null);

  // Tên modal đang mở (null = không mở modal nào)
  const [modal, setModal] = useState(null);

  // Trạng thái mở/đóng của từng chương trong màn hình quản lý
  const [openSections, setOpenSections] = useState({});

  // Tab đang hiển thị: "overview" | "courses" | "manage"
  const [view, setView] = useState("overview");

  // Thống kê cứng (sẽ thay bằng API thật sau khi backend hỗ trợ)
  const totalSections = 12;
  const totalLessonsAll = 36;

  // ─── 2. HELPERS ────────────────────────────────────────────────────────────

  /**
   * Tải lại danh sách khóa học từ server.
   * Gọi sau mọi thao tác thêm / sửa / xóa khóa học.
   */
  const refreshCourses = async () => {
    console.log("Current User Context:", user);
    if (!user?.id) return;
    console.log(user.token);
    const data = await teacherApi.getCourses(user.token, user.id);

    // Thêm trường `title` và ảnh placeholder nếu chưa có
    const courses = data.map((c) => ({
      ...c,
      title: c.name || "Không có tên",
      image:
        c.image ||
        `https://placehold.co/320x180/5624d0/ffffff?text=${encodeURIComponent((c.name || "Course").slice(0, 10))}`,
      sections: [], // chương sẽ được tải riêng khi mở quản lý
    }));

    setCourses(courses);

    // Nếu đang quản lý một khóa học, cập nhật thông tin cơ bản của nó
    setSelectedCourse((prev) => {
      if (!prev) return null;
      const updated = courses.find((c) => c.id === prev.id);
      return updated ? { ...updated, sections: prev.sections } : prev;
    });
  };

  /**
   * Tải chương và bài học của một khóa học cụ thể.
   * Gọi khi giáo viên bấm vào "Quản lý" hoặc sau khi thêm / sửa / xóa chương / bài học.
   */
  const refreshSelectedCourse = async (courseId) => {
    if (!user?.token) return;

    // Tải tất cả chương
    const chapters = await teacherApi.getChapters(user.token, courseId);

    // Với mỗi chương, tải tiếp danh sách bài học
    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        try {
          const lessons = await teacherApi.getLessons(user.token, chapter.id);
          return { ...chapter, lessons };
        } catch {
          return { ...chapter, lessons: [] };
        }
      }),
    );

    setSelectedCourse((prev) => {
      if (!prev || prev.id !== courseId) return prev;
      return { ...prev, sections: chaptersWithLessons };
    });
  };

  // Tải danh mục và khóa học khi component mount (hoặc khi user thay đổi)
  useEffect(() => {
    const init = async () => {
      console.log("Teacher Dashboard useEffect triggered. User:", user);
      if (!user?.id) {
        console.log("Exiting early: user.id is missing!");
        return;
      }
      setCategories(await teacherApi.getCategories());
      await refreshCourses();
    };
    init();
  }, [user]);

  // ─── 3. COURSES ────────────────────────────────────────────────────────────

  /**
   * Callback khi tạo khóa học mới thành công.
   * `CreateCourseModal` gọi hàm này và truyền vào dữ liệu khóa học vừa tạo.
   */
  const onCourseCreated = () => {
    refreshCourses();
    setModal(null);
  };

  /**
   * Callback khi sửa khóa học thành công.
   */
  const onCourseUpdated = () => {
    refreshCourses();
    setModal(null);
  };

  /** Xóa khóa học, hiển thị thông báo */
  const handleDeleteCourse = (courseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?"))
      return;

    toast.promise(
      (async () => {
        await teacherApi.deleteCourse(user.token, courseId);
        await refreshCourses();
        // Nếu đang quản lý khóa học vừa xóa → quay về danh sách
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(null);
          setView("courses");
        }
      })(),
      {
        loading: "Đang xóa khóa học...",
        success: "Xóa khóa học thành công!",
        error: (err) =>
          `Xóa thất bại: ${err.response?.data?.message || err.message}`,
      },
    );
  };

  /** Bật / tắt xuất bản khóa học */
  const togglePublish = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const formData = new FormData();
    formData.append("data", JSON.stringify({ active: !course.active }));

    toast.promise(
      (async () => {
        await teacherApi.updateCourse(user.token, courseId, formData);
        await refreshCourses();
      })(),
      {
        loading: "Đang cập nhật trạng thái...",
        success: course.active ? "Đã ẩn khóa học" : "Đã xuất bản khóa học",
        error: (err) =>
          `Cập nhật thất bại: ${err.response?.data?.message || err.message}`,
      },
    );
  };

  // ─── 4. CHAPTERS ───────────────────────────────────────────────────────────

  /**
   * Thêm chương mới vào khóa học đang chọn.
   * `AddChapterModal` gọi hàm này với dữ liệu form: { title, description }
   */
  const handleAddChapter = async ({ title }) => {
    if (!selectedCourse) return;
    try {
      await teacherApi.createChapter(user.token, selectedCourse.id, {
        name: title,
        order: selectedCourse.sections?.length ?? 0,
        free: false,
      });
      await refreshSelectedCourse(selectedCourse.id);
      setModal(null);
    } catch (err) {
      toast.error(
        `Thêm chương thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /**
   * Sửa tên chương.
   * `EditChapterModal` gọi hàm này với dữ liệu form: { title }
   */
  const handleUpdateChapter = async ({ title }) => {
    if (!editingChapter) return;
    try {
      await teacherApi.updateChapter(user.token, editingChapter.id, {
        name: title,
        order: editingChapter.order,
        free: editingChapter.free ?? false,
      });
      await refreshSelectedCourse(selectedCourse.id);
      setModal(null);
      setEditingChapter(null);
    } catch (err) {
      toast.error(
        `Sửa chương thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /** Xóa chương */
  const handleDeleteSection = async (courseId, chapterId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này không?")) return;
    try {
      await teacherApi.deleteChapter(user.token, chapterId);
      await refreshSelectedCourse(courseId);
    } catch (err) {
      toast.error(
        `Xóa chương thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /** Mở modal thêm chương */
  const openAddChapter = () => setModal("add-chapter");

  /** Mở modal sửa chương */
  const openEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setModal("edit-chapter");
  };

  /** Di chuyển thứ tự chương (chỉ cập nhật UI, chưa có API thứ tự) */
  const handleMoveSection = (index, direction) => {
    if (!selectedCourse) return;
    const sections = [...selectedCourse.sections];
    if (direction === "up" && index > 0) {
      [sections[index], sections[index - 1]] = [
        sections[index - 1],
        sections[index],
      ];
    } else if (direction === "down" && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [
        sections[index + 1],
        sections[index],
      ];
    }
    setSelectedCourse((prev) => ({ ...prev, sections }));
  };

  // ─── 5. LESSONS ────────────────────────────────────────────────────────────

  /**
   * Thêm bài học mới.
   * `AddLessonModal` gọi hàm này với: { title, content, videoFile }
   */
  const handleAddLesson = async ({ title, content, videoFile }) => {
    if (!targetChapterId || !videoFile) return;
    try {
      const formData = new FormData();
      // "data" là phần JSON, "video" là file upload
      formData.append(
        "data",
        new Blob(
          [JSON.stringify({ title, content: content || "", order: 1 })],
          {
            type: "application/json",
          },
        ),
      );
      formData.append("video", videoFile);

      await teacherApi.createLesson(user.token, targetChapterId, formData);
      await refreshSelectedCourse(selectedCourse.id);
      setModal(null);
    } catch (err) {
      toast.error(
        `Thêm bài học thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /**
   * Sửa bài học.
   * `EditLessonModal` gọi hàm này với: { title, content, videoFile? }
   */
  const handleUpdateLesson = async ({ title, content, videoFile }) => {
    if (!editingLesson) return;
    try {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify({ title, content: content || "" })], {
          type: "application/json",
        }),
      );
      if (videoFile) {
        formData.append("video", videoFile);
      }

      await teacherApi.updateLesson(user.token, editingLesson.id, formData);
      await refreshSelectedCourse(selectedCourse.id);
      setModal(null);
      setEditingLesson(null);
    } catch (err) {
      toast.error(
        `Sửa bài học thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /** Xóa bài học */
  const handleDeleteLesson = async (chapterId, lessonId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này không?")) return;
    try {
      await teacherApi.deleteLesson(user.token, lessonId);
      await refreshSelectedCourse(selectedCourse.id);
    } catch (err) {
      toast.error(
        `Xóa bài học thất bại: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  /** Mở modal thêm bài học (nhớ lưu lại chương nào đang thêm vào) */
  const openAddLesson = (chapterId) => {
    setTargetChapterId(chapterId);
    setModal("add-lesson");
  };

  /** Mở modal sửa bài học */
  const openEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setModal("edit-lesson");
  };

  /** Di chuyển thứ tự bài học (chỉ cập nhật UI) */
  const handleMoveLesson = (chapterId, lessonIndex, direction) => {
    if (!selectedCourse) return;
    const sections = selectedCourse.sections.map((s) => {
      if (s.id !== chapterId) return s;
      const lessons = [...(s.lessons || [])];
      if (direction === "up" && lessonIndex > 0) {
        [lessons[lessonIndex], lessons[lessonIndex - 1]] = [
          lessons[lessonIndex - 1],
          lessons[lessonIndex],
        ];
      } else if (direction === "down" && lessonIndex < lessons.length - 1) {
        [lessons[lessonIndex], lessons[lessonIndex + 1]] = [
          lessons[lessonIndex + 1],
          lessons[lessonIndex],
        ];
      }
      return { ...s, lessons };
    });
    setSelectedCourse((prev) => ({ ...prev, sections }));
  };

  // ─── 6. UI ─────────────────────────────────────────────────────────────────

  /** Mở màn hình quản lý khóa học và tải dữ liệu chi tiết */
  const openManage = (course) => {
    setSelectedCourse({ ...course, sections: [] });
    setOpenSections({});
    setView("manage");
    refreshSelectedCourse(course.id);
  };

  /** Bật / tắt mở rộng một chương trong màn hình quản lý */
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Khóa học đang được chỉnh sửa (dùng cho EditCourseModal)
  const editingCourse =
    courses.find((c) => c.id === selectedCourse?.id) || null;

  // ─── RETURN ────────────────────────────────────────────────────────────────

  return {
    // State
    user,
    courses,
    categories,
    selectedCourse,
    editingChapter,
    editingLesson,
    modal,
    setModal,
    openSections,
    view,
    setView,

    // Thống kê
    totalSections,
    totalLessonsAll,
    editingCourse,

    // Courses
    onCourseCreated,
    onCourseUpdated,
    handleDeleteCourse,
    togglePublish,

    // Chapters
    openAddChapter,
    handleAddChapter,
    openEditChapter,
    handleUpdateChapter,
    handleDeleteSection,
    handleMoveSection,

    // Lessons
    openAddLesson,
    handleAddLesson,
    openEditLesson,
    handleUpdateLesson,
    handleDeleteLesson,
    handleMoveLesson,

    // UI
    openManage,
    toggleSection,
  };
};
