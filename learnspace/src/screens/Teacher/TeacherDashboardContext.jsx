import React, { createContext, useContext } from "react";
import { useTeacherDashboard } from "./useTeacherDashboard";

const TeacherDashboardContext = createContext(null);

export const TeacherDashboardProvider = ({ children }) => {
  const dashboard = useTeacherDashboard();
  return (
    <TeacherDashboardContext.Provider value={dashboard}>
      {children}
    </TeacherDashboardContext.Provider>
  );
};

export const useTeacherDashboardContext = () => {
  const context = useContext(TeacherDashboardContext);
  if (!context) {
    throw new Error(
      "useTeacherDashboardContext nằm ngoài phạm vi củacủa TeacherDashboardProvider",
    );
  }
  return context;
};
