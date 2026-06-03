import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Layers,
  ListVideo,
  DollarSign,
  CheckCircle,
  Clock,
  Pencil,
  Eye,
  Trash2,
  PlusCircle,
} from "lucide-react";
import CreateCourseModal from "../Modals/CreateCourseModal/CreateCourseModal";
import EditCourseModal from "../Modals/EditCourseModal/EditCourseModal";
import CourseRowItem from "./CourseRowItem";
import PaginationUI from "../PaginationUI/PaginationUI";
import "./CoursesTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";

const CoursesTab = ({ onManageCourse }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    teacherCourses,
    handleLoadCourseOfTeacher,
    handleDeleteCourse,
    handleLoadCategories,
    categories,
    totalPages,
  } = useTeacherDashBoard();

  useEffect(() => {
    handleLoadCourseOfTeacher(currentPage);
  }, [currentPage]);

  useEffect(() => {
    handleLoadCategories();
  }, []);

  return (
    <div className="courses-container">
      {/* Action bar */}
      <div className="action-bar-wrapper">
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-course-btn"
        >
          <PlusCircle size={16} /> Tạo khóa học mới
        </button>
      </div>

      <div className="courses-card-wrapper">
        <table className="courses-table">
          <thead>
            <tr className="courses-table-header">
              <th className="courses-th">Khóa học</th>
              <th className="courses-th">Chương</th>
              <th className="courses-th">Bài học</th>
              <th className="courses-th">Giá</th>
              <th className="courses-th"></th>
            </tr>
          </thead>
          <tbody>
            {teacherCourses.map((course) => (
              <CourseRowItem
                key={course.id}
                course={course}
                onEdit={(c) => {
                  setShowEditModal(true);
                  setSelectedCourse(c);
                }}
                onManageCourse={onManageCourse}
                onDelete={handleDeleteCourse}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationUI
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        onSuccess={() => {
          handleLoadCourseOfTeacher(currentPage);
          setShowCreateModal(false);
        }}
      />

      <EditCourseModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        course={selectedCourse}
        categories={categories}
        onSuccess={() => {
          handleLoadCourseOfTeacher(currentPage);
          setShowEditModal(false);
        }}
      />
    </div>
  );
};

export default CoursesTab;
