import React, { useEffect, useState } from "react";
import { Layers, ListVideo, FolderPlus, Pencil } from "lucide-react";
import AddChapterModal from "../Modals/AddChapterModal/AddChapterModal";
import EditChapterModal from "../Modals/EditChapterModal/EditChapterModal";
import AddLessonModal from "../Modals/AddLessonModal/AddLessonModal";
import EditLessonModal from "../Modals/EditLessonModal/EditLessonModal";
import EditCourseModal from "../Modals/EditCourseModal/EditCourseModal";
import ChapterRow from "./ChapterRow/ChapterRow";
import "./ManageCourseTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";
import { authApis, endpoints } from "@/configs/Apis";

const ManageCourseTab = ({ course, onCourseUpdate }) => {
  const {
    teacherCourses,
    setTeacherCourses,
    user,
    loadCourseDetails,
    handleCreateChapter,
    handleDeleteChapter,
    handleCreateLesson,
    handleUpdateLesson,
    handleDeleteLesson,
    handleLoadCategories,
    categories,
  } = useTeacherDashBoard();

  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showEditChapter, setShowEditChapter] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(null);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleReorderChapters = async (fromIndex, toIndex) => {
    const chapters = [...(currentCourse.chapters || [])];
    const [moved] = chapters.splice(fromIndex, 1);
    chapters.splice(toIndex, 0, moved);

    // Cập nhật UI ngay lập tức
    setTeacherCourses((prev) =>
      prev.map((c) => {
        if (c.id === course?.id) {
          return { ...c, chapters };
        }
        return c;
      }),
    );

    // Xác định ID của chapter đứng trước và sau ở vị trí mới
    const prevChapter = toIndex > 0 ? chapters[toIndex - 1] : null;
    const nextChapter =
      toIndex < chapters.length - 1 ? chapters[toIndex + 1] : null;

    const prevId = prevChapter ? prevChapter.id : null;
    const nextId = nextChapter ? nextChapter.id : null;

    try {
      // Gửi PATCH request vào api /chapters/<chapterId> của chapter bị di chuyển
      await authApis(user.token).patch(`${endpoints.chapters}/${moved.id}`, {
        frontChapterId: prevId,
        behindChapterId: nextId,
      });
      console.log("Cập nhật thứ tự chương thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật thứ tự chương!");
    }
  };

  const handleReorderLessons = async (chapterId, fromIndex, toIndex) => {
    const chapter = currentCourse.chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return;

    const lessons = [...(chapter.lessons || [])];
    const [moved] = lessons.splice(fromIndex, 1);
    lessons.splice(toIndex, 0, moved);

    const prevId = toIndex > 0 ? lessons[toIndex - 1].id : null;
    const nextId =
      toIndex < lessons.length - 1 ? lessons[toIndex + 1].id : null;

    setTeacherCourses((prev) =>
      prev.map((c) => {
        if (c.id === course?.id) {
          return {
            ...c,
            chapters: c.chapters.map((ch) => {
              if (ch.id === chapterId) {
                return { ...ch, lessons };
              }
              return ch;
            }),
          };
        }
        return c;
      }),
    );

    try {
      const formData = new FormData();
      if (prevId) formData.append("frontLessonId", prevId);
      if (nextId) formData.append("behindLessonId", nextId);

      await authApis(user.token).patch(
        `${endpoints.lessons}/${moved.id}`,
        formData,
      );
      console.log("Cập nhật thứ tự bài học thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật thứ tự bài học!");
    }
  };

  const currentCourse =
    teacherCourses.find((c) => c.id === course?.id) || course;

  const totalChapters = currentCourse?.chapters?.length || 0;
  const totalLessons =
    currentCourse?.chapters?.reduce(
      (count, chapter) => count + (chapter?.lessons?.length || 0),
      0,
    ) || 0;

  const submitChapter = async (chapterData) => {
    await handleCreateChapter(course?.id, {
      name: chapterData.title,
      free: false,
    });
    setShowAddChapter(false);
  };

  const submitLesson = async (lessonData) => {
    if (!showAddLesson) return;
    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("content", lessonData.content || "");
    if (lessonData.videoFile) {
      formData.append("videoFile", lessonData.videoFile);
    }
    try {
      await handleCreateLesson(showAddLesson, formData);
      setShowAddLesson(null);
    } catch (err) {
      console.error("Đã có lỗi xảy ra!");
    }
  };
  const updateLesson = async (lessonData) => {
    if (!showEditLesson) return;
    const formData = new FormData();
    formData.append("title", lessonData.title);
    formData.append("content", lessonData.content || "");
    if (lessonData.videoFile) {
      formData.append("videoFile", lessonData.videoFile);
    }
    try {
      await handleUpdateLesson(selectedLesson.id, formData);
      setShowEditLesson(false);
    } catch (err) {
      console.error("Đã có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    if (course?.id) {
      loadCourseDetails(course.id);
    }
  }, [course?.id]);

  useEffect(() => {
    handleLoadCategories();
  }, []);

  return (
    <div className="manage-course-container">
      {/* Mini stats */}
      <div className="mini-stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon-wrapper"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            <Layers size={20} style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <div className="stat-value">{totalChapters}</div>
            <div className="stat-label">Chương</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon-wrapper"
            style={{ background: "rgba(16,185,129,0.08)" }}
          >
            <ListVideo size={20} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div className="stat-value">{totalLessons}</div>
            <div className="stat-label">Bài học</div>
          </div>
        </div>

        {/* Nút sửa thông tin khóa học */}
        <button
          onClick={() => setShowEditCourse(true)}
          className="edit-course-btn"
        >
          <div className="stat-icon-wrapper bg-[rgba(59,130,246,0.08)]">
            <Pencil size={20} className="text-[#3b82f6]" />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#1c1d1f]">
              Chỉnh sửa
            </div>
            <div className="stat-label">Thông tin khóa học</div>
          </div>
        </button>

        {/* Nút thêm chương */}
        <button
          onClick={() => setShowAddChapter(true)}
          className="add-chapter-btn"
        >
          <div className="stat-icon-wrapper bg-[rgba(139,92,246,0.08)]">
            <FolderPlus size={20} className="text-[#8b5cf6]" />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[#1c1d1f]">
              Thêm chương
            </div>
            <div className="stat-label">Tạo chương mới</div>
          </div>
        </button>
      </div>

      {/* Danh sách chương */}
      <div className="sections-list">
        {(currentCourse?.chapters || []).map((chapter, index) => {
          return (
            <ChapterRow
              key={chapter.id}
              chapter={chapter}
              index={index}
              onReorderChapters={handleReorderChapters}
              onAddLesson={setShowAddLesson}
              onEditChapter={() => setShowEditChapter(true)}
              onDeleteChapter={handleDeleteChapter}
              onReorderLessons={handleReorderLessons}
              onEditLesson={(lesson) => {
                setSelectedLesson(lesson);
                setShowEditLesson(true);
              }}
              onDeleteLesson={handleDeleteLesson}
            />
          );
        })}
      </div>

      {/* ─── MODALS ─────────────────────────────────────────── */}
      <AddChapterModal
        open={showAddChapter}
        onClose={() => setShowAddChapter(false)}
        onSubmit={submitChapter}
        course={course}
      />

      <EditChapterModal
        open={showEditChapter}
        onClose={() => setShowEditChapter(false)}
        chapter={{ name: "Chương mẫu" }}
        onSubmit={() => setShowEditChapter(false)}
      />

      <AddLessonModal
        open={showAddLesson !== null}
        onClose={() => setShowAddLesson(null)}
        onSubmit={submitLesson}
      />

      <EditLessonModal
        open={showEditLesson}
        onClose={() => setShowEditLesson(false)}
        lesson={selectedLesson}
        onSubmit={(formData) => updateLesson(formData)}
      />

      <EditCourseModal
        open={showEditCourse}
        onClose={() => setShowEditCourse(false)}
        course={course}
        categories={categories}
        onSuccess={(updatedCourse) => {
          setTeacherCourses((prev) =>
            prev.map((c) =>
              c.id === course?.id ? { ...c, ...updatedCourse } : c,
            ),
          );
          if (onCourseUpdate) {
            onCourseUpdate({ ...currentCourse, ...updatedCourse });
          }
          setShowEditCourse(false);
        }}
      />
    </div>
  );
};

export default ManageCourseTab;
