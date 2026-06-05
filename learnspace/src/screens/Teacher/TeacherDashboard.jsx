import React, { useState } from "react";
import Sidebar from "@/components/TeacherDashboard/Sidebar/Sidebar";
import Header from "@/components/TeacherDashboard/Header";
import OverviewTab from "@/components/TeacherDashboard/OverviewTab/OverviewTab";
import CoursesTab from "@/components/TeacherDashboard/CoursesTab/CoursesTab";
import ManageCourseTab from "@/components/TeacherDashboard/ManageCourseTab/ManageCourseTab";

const TeacherDashboard = () => {
  const [view, setView] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setView("manage");
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setView("courses");
  };

  return (
    <div className="font-sans min-h-screen flex bg-[#f7f9fa] text-[#1c1d1f]">
      <Sidebar view={view} setView={setView} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          view={view}
          selectedCourse={selectedCourse}
          onBackToCourses={handleBackToCourses}
        />

        {view === "overview" && (
          <OverviewTab onManageCourse={handleManageCourse} />
        )}

        {view === "courses" && (
          <CoursesTab onManageCourse={handleManageCourse} />
        )}

        {view === "manage" && selectedCourse && (
          <ManageCourseTab
            course={selectedCourse}
            onCourseUpdate={(updatedCourse) => setSelectedCourse(updatedCourse)}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
