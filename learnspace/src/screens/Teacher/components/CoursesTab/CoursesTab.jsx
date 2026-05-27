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
import CreateCourseModal from "../Modals/CreateCourseModal";
import EditCourseModal from "../Modals/EditCourseModal";
import "./CoursesTab.css";
import useTeacherDashBoard from "@/hooks/useTeacherDashBoard";

const CoursesTab = ({ onManageCourse }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const {
    teacherCourses,
    handleLoadCourseOfTeacher,
    handleUpdateCourse,
    handleDeleteCourse,
  } = useTeacherDashBoard();

  const countChap = (course) => course?.chapters?.length || 0;
  const countLessons = (chapter) => chapter?.lessons?.length || 0;

  useEffect(() => {
    handleLoadCourseOfTeacher();
  }, []);

  return (
    <div className="courses-container">
      {/* Action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 28px 0",
        }}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            background: "#5624d0",
            color: "white",
            fontWeight: 700,
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(86,36,208,0.3)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#4712c4")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#5624d0")}
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
              <th className="courses-th">Trạng thái</th>
              <th className="courses-th"></th>
            </tr>
          </thead>
          <tbody>
            {teacherCourses.map((course) => {
              return (
                <tr key={course.id} className="courses-tr">
                  <td className="courses-td">
                    <div className="course-info">
                      <img
                        src={
                          course.image
                            ? course.image
                            : `https://placehold.co/320x180/5624d0/ffffff?text=${course.name}`
                        }
                        alt={course.name}
                        className="course-thumb"
                      />
                      <div className="min-w-0">
                        <div className="course-title">{course.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <Layers size={14} className="text-[#9ca3af]" />
                      <span className="meta-count">{countChap(course)}</span>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <ListVideo size={14} className="text-[#9ca3af]" />
                      <span className="meta-count">
                        {countLessons(course.chapters)}
                      </span>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <DollarSign size={14} className="text-[#9ca3af]" />
                      <span className="price-text">{course.price} VNĐ</span>
                    </div>
                  </td>
                  <td className="courses-td">
                    {course.active ? (
                      <button
                        className="status-badge active"
                        onClick={() => {
                          const form = new FormData();
                          form.append("active", false);
                          handleUpdateCourse(course.id, form);
                        }}
                      >
                        <CheckCircle size={12} />
                        Đã xuất bản
                      </button>
                    ) : (
                      <button
                        className="status-badge inactive"
                        onClick={() => {
                          const form = new FormData();
                          form.append("active", true);
                          handleUpdateCourse(course.id, form);
                        }}
                      >
                        <Clock size={12} />
                        Chưa xuất bản
                      </button>
                    )}
                  </td>
                  <td className="courses-td">
                    <div className="action-buttons-group">
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setSelectedCourse(course);
                        }}
                        title="Chỉnh sửa thông tin khóa học"
                        className="action-icon-btn edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onManageCourse(course)}
                        title="Quản lý chương/bài học"
                        className="action-icon-btn manage"
                      >
                        <Layers size={15} />
                      </button>
                      <Link
                        to={`/course/${course.id}`}
                        title="Xem trang chi tiết"
                        className="action-icon-btn view"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        title="Xóa khóa học"
                        className="action-icon-btn delete"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={[
          { id: 1, name: "Lập trình" },
          { id: 2, name: "Thiết kế" },
        ]}
        onSuccess={() => {
          handleLoadCourseOfTeacher();
          setShowCreateModal(false);
        }}
      />

      <EditCourseModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        course={selectedCourse}
        categories={[
          { id: 1, name: "Lập trình" },
          { id: 2, name: "Thiết kế" },
        ]}
        onSuccess={() => {
          handleLoadCourseOfTeacher();
          setShowEditModal(false);
        }}
      />
    </div>
  );
};

export default CoursesTab;
