import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  Pencil,
  GripVertical,
} from "lucide-react";
import "./ChapterRow.css";

const ChapterRow = ({
  chapter,
  index,
  onReorderChapters,
  onAddLesson,
  onEditChapter,
  onDeleteChapter,
  onReorderLessons,
  onEditLesson,
  onDeleteLesson,
}) => {
  const [isOpen, setIsOpen] = useState(index === 0); // Mở chương đầu tiên làm mặc định
  const [draggedLessonIndex, setDraggedLessonIndex] = useState(null);

  const lessonsCount = chapter?.lessons?.length || 0;

  return (
    <div
      className="chapter-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("chapterIndex", index.toString());
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const draggedIdxStr = e.dataTransfer.getData("chapterIndex");
        if (draggedIdxStr) {
          const draggedIdx = parseInt(draggedIdxStr, 10);
          if (draggedIdx !== index) {
            onReorderChapters(draggedIdx, index);
          }
        }
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
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
              onAddLesson(chapter.id);
            }}
            className="btn-add-lesson"
          >
            <Plus size={13} />
            Thêm bài học
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditChapter(true);
            }}
            className="btn-chapter-edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChapter(chapter.id);
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
                  setDraggedLessonIndex(lessonIdx);
                  e.dataTransfer.setData("lessonIndex", lessonIdx.toString());
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    draggedLessonIndex !== null &&
                    draggedLessonIndex !== lessonIdx
                  ) {
                    onReorderLessons(
                      chapter.id,
                      draggedLessonIndex,
                      lessonIdx,
                    );
                  }
                  setDraggedLessonIndex(null);
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
                  onClick={() => onEditLesson(lesson)}
                  className="btn-lesson-edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDeleteLesson(lesson.id)}
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
};

export default ChapterRow;
