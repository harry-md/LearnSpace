import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import OverviewTab from "./components/OverviewTab/OverviewTab";
import CoursesTab from "./components/CoursesTab/CoursesTab";
import ManageCourseTab from "./components/ManageCourseTab/ManageCourseTab";
import DashboardModals from "./components/DashboardModals";
import { TeacherDashboardProvider, useTeacherDashboardContext } from "./TeacherDashboardContext";

const DashboardContent = () => {
  const { view, selectedCourse } = useTeacherDashboardContext();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Inter', sans-serif",
        background: "#f7f9fa",
        color: "#1c1d1f",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        {view === "overview" && <OverviewTab />}

        {view === "courses" && <CoursesTab />}

        {view === "manage" && selectedCourse && <ManageCourseTab />}
      </div>

      <DashboardModals />
    </div>
  );
};

const TeacherDashboard = () => {
  return (
    <TeacherDashboardProvider>
      <DashboardContent />
    </TeacherDashboardProvider>
  );
};

export default TeacherDashboard;
