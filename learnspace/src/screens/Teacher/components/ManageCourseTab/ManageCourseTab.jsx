import React, { useEffect, useState } from "react";
import {
  Layers,
  ListVideo,
  FolderPlus,
  FileText,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  FileQuestion,
  Pencil,
  GripVertical,
} from "lucide-react";
import AddChapterModal from "../Modals/AddChapterModal";
import EditChapterModal from "../Modals/EditChapterModal";
import AddLessonModal from "../Modals/AddLessonModal";
import EditLessonModal from "../Modals/EditLessonModal";
import EditCourseModal from "../Modals/EditCourseModal";
import "./ManageCourseTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";
import { authApis, endpoints } from "@/configs/Apis";

const ManageCourseTab = ({ course }) => {
  const {
    teacherCourses,
    setTeacherCourses,
    user,
    handleLoadCourseOfTeacher,
    handleCreateChapter,
    handleDeleteChapter,
    handleCreateLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  } = useTeacherDashBoard();

  const [openSections, setOpenSections] = useState({ 1: true });

  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showEditChapter, setShowEditChapter] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(null);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const [draggedChapterIndex, setDraggedChapterIndex] = useState(null);
  const [draggedLessonInfo, setDraggedLessonInfo] = useState(null); // { chapterId, index }

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
      console.error("Lỗi cập nhật thứ tự chương:", err);
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
      console.error("Lỗi cập nhật thứ tự bài học:", err);
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
      console.error(err);
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
      console.error(err);
    }
  };

  useEffect(() => {
    handleLoadCourseOfTeacher();
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            background: "white",
            border: "2px dashed #d1d5db",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8b5cf6")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
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
          const lessonsCount = chapter?.lessons?.length || 0;
          const isOpen = openSections[chapter.id];

          return (
            <div
              key={chapter.id}
              className="chapter-card"
              draggable
              onDragStart={(e) => {
                setDraggedChapterIndex(index);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (
                  draggedChapterIndex !== null &&
                  draggedChapterIndex !== index
                ) {
                  handleReorderChapters(draggedChapterIndex, index);
                }
                setDraggedChapterIndex(null);
              }}
            >
              <div
                onClick={() => toggleSection(chapter.id)}
                className="chapter-header"
                style={{ cursor: "grab" }}
              >
                <div className="chapter-idx-box">
                  <GripVertical
                    size={14}
                    className="text-[#9ca3af] mr-1 shrink-0"
                  />
                  <span className="chapter-idx-text">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="chapter-title">{chapter.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FileText size={12} className="text-[#9ca3af]" />
                    <span className="text-xs text-[#9ca3af]">
                      {lessonsCount} bài học
                    </span>
                    {chapter.free && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Học thử
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddLesson(chapter.id);
                    }}
                    className="btn-add-lesson"
                  >
                    <Plus size={13} />
                    Thêm bài học
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditChapter(true);
                    }}
                    className="btn-chapter-edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteChapter(chapter.id);
                    }}
                    className="btn-chapter-delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-[#9ca3af]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#9ca3af]" />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-[#f3f4f6]">
                  {(chapter.lessons || []).map((lesson, lessonIdx) => {
                    return (
                      <div
                        key={lesson.id}
                        className="group lesson-row"
                        style={{ cursor: "grab" }}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDraggedLessonInfo({
                            chapterId: chapter.id,
                            index: lessonIdx,
                          });
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            draggedLessonInfo &&
                            draggedLessonInfo.chapterId === chapter.id &&
                            draggedLessonInfo.index !== lessonIdx
                          ) {
                            handleReorderLessons(
                              chapter.id,
                              draggedLessonInfo.index,
                              lessonIdx,
                            );
                          }
                          setDraggedLessonInfo(null);
                        }}
                      >
                        <GripVertical
                          size={13}
                          className="text-[#d1d5db] shrink-0 mr-1"
                        />
                        <span className="lesson-idx">{lessonIdx + 1}</span>
                        <PlayCircle size={14} className="text-[#8b5cf6]" />
                        <span className="lesson-title">{lesson.title}</span>
                        {lesson.free && (
                          <span className="lesson-free-badge">FREE</span>
                        )}
                        {lesson.videoLength && (
                          <span className="lesson-duration">
                            {Math.floor(lesson.videoLength / 60)}:
                            {String(lesson.videoLength % 60).padStart(2, "0")}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setShowEditLesson(true);
                            setSelectedLesson(lesson);
                          }}
                          className="btn-lesson-edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="btn-lesson-delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
        categories={[
          { id: 1, name: "Lập trình" },
          { id: 2, name: "Thiết kế" },
        ]}
        onSuccess={() => setShowEditCourse(false)}
      />
    </div>
  );
};

export default ManageCourseTab;
