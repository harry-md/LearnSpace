import React, { useEffect, useState } from "react";
import { BookOpen, Layers, Video } from "lucide-react";
import StatCard from "./StatCard/StatCard";
import PerformanceTable from "./PerformanceTable/PerformanceTable";
import "./OverviewTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";

const OverviewTab = ({ onManageCourse }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    teacherCourses,
    totalCourses,
    totalPages,
    handleLoadCourseOfTeacher,
  } = useTeacherDashBoard();

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
    handleLoadCourseOfTeacher(currentPage);
  }, [currentPage]);

  return (
    <div className="overview-container">
      <div className="stats-grid">
        <StatCard
          icon={BookOpen}
          color="#8b5cf6"
          bgColor="rgba(139,92,246,0.08)"
          value={totalCourses || 0}
          label="Khóa học"
        />

        <StatCard
          icon={Layers}
          color="#10b981"
          bgColor="rgba(16,185,129,0.08)"
          value={countChapter()}
          label="Tổng chương"
          subLabel="Tất cả khóa học"
        />

        <StatCard
          icon={Video}
          color="#f59e0b"
          bgColor="rgba(245,158,11,0.08)"
          value={countLesson()}
          label="Tổng bài học"
        />
      </div>

      <PerformanceTable
        teacherCourses={teacherCourses}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default OverviewTab;
