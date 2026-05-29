import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import OverviewTab from "./components/OverviewTab/OverviewTab";
import CoursesTab from "./components/CoursesTab/CoursesTab";
import ManageCourseTab from "./components/ManageCourseTab/ManageCourseTab";

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
    <div
      className="font-sans"
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f7f9fa",
        color: "#1c1d1f",
      }}
    >
      <Sidebar view={view} setView={setView} />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
