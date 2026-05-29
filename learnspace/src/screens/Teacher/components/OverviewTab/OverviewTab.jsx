import React, { useEffect } from "react";
import { BookOpen, Layers, Video, ArrowRight } from "lucide-react";
import "./OverviewTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";

const OverviewTab = ({ onManageCourse }) => {
  const { teacherCourses, handleLoadCourseOfTeacher } = useTeacherDashBoard();

  const countChapter = () =>
    teacherCourses.reduce(
      (count, course) => count + (course?.chapterCount || 0),
      0,
    );
  const countLesson = () =>
    teacherCourses.reduce(
      (count, course) => count + (course?.lessonCount || 0),
      0,
    );

  useEffect(() => {
    handleLoadCourseOfTeacher();
  }, []);

  return (
    <div className="overview-container">
      <div className="stats-grid">
        <div
          className="overview-stat-card"
          style={{ borderLeft: "4px solid #8b5cf6" }}
        >
          <div
            className="stat-icon-container"
            style={{ background: "rgba(139,92,246,0.08)" }}
          >
            <BookOpen size={24} style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <div className="stat-num-val">{teacherCourses.length}</div>
            <div className="stat-num-label">Khóa học</div>
          </div>
        </div>

        <div
          className="overview-stat-card"
          style={{ borderLeft: "4px solid #10b981" }}
        >
          <div
            className="stat-icon-container"
            style={{ background: "rgba(16,185,129,0.08)" }}
          >
            <Layers size={24} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div className="stat-num-val">{countChapter()}</div>
            <div className="stat-num-label">Tổng chương</div>
            <div className="stat-num-sub">Tất cả khóa học</div>
          </div>
        </div>

        <div
          className="overview-stat-card"
          style={{ borderLeft: "4px solid #f59e0b" }}
        >
          <div
            className="stat-icon-container"
            style={{ background: "rgba(245,158,11,0.08)" }}
          >
            <Video size={24} style={{ color: "#f59e0b" }} />
          </div>
          <div>
            <div className="stat-num-val">{countLesson()}</div>
            <div className="stat-num-label">Tổng bài học</div>
          </div>
        </div>
      </div>

      <div className="course-list-wrapper">
        <div className="course-list-header">
          <BookOpen size={18} className="text-[#8b5cf6]" />
          <h2 className="course-list-title">Khóa học của bạn</h2>
        </div>
        {teacherCourses.map((course) => {
          return (
            <div
              key={course.id}
              className="course-row-item"
              style={{ borderBottom: "1px solid #f9fafb" }}
              onClick={() => onManageCourse(course)}
            >
              <img
                src={
                  course.image
                    ? course.image
                    : `https://placehold.co/320x180/5624d0/ffffff?text=${course.name}`
                }
                alt={course.name}
                className="course-row-thumb"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="course-row-title">{course.name}</span>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="course-row-price">{course.price} ₫</span>
                    {course.active ? (
                      <span className="course-row-badge active">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="course-row-badge draft">Bản nháp</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#9ca3af]">
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewTab;
