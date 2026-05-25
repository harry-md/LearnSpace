import React from "react";
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
} from "lucide-react";
import { totalLessons } from "../../../../data/TeacherData";
import { useTeacherDashboardContext } from "../../TeacherDashboardContext";
import "./CoursesTab.css";

const CoursesTab = () => {
  const {
    courses,
    setModal,
    togglePublish,
    openManage,
    handleDeleteCourse,
    openEditCourse,
  } = useTeacherDashboardContext();

  return (
    <div className="courses-container">
      <div className="courses-card-wrapper">
        {courses.length === 0 && (
          <div className="empty-state">
            <BookOpen size={48} className="opacity-30" />
            <p className="font-semibold text-[15px]">Chưa có khóa học nào.</p>
            <button
              onClick={() => setModal("create-course")}
              className="btn-primary"
            >
              <Plus size={15} /> Tạo khóa học đầu tiên
            </button>
          </div>
        )}
        {courses.length > 0 && (
          <table className="courses-table">
            <thead>
              <tr className="courses-table-header">
                {["Khóa học", "Chương", "Bài học", "Giá", "Trạng thái", ""].map(
                  (h, i) => (
                    <th key={i} className="courses-th">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="courses-tr">
                  <td className="courses-td">
                    <div className="course-info">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="course-thumb"
                      />
                      <div className="min-w-0">
                        <div className="course-title">{course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <Layers size={14} className="text-[#9ca3af]" />
                      <span className="meta-count">
                        {course.sections.length}
                      </span>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <ListVideo size={14} className="text-[#9ca3af]" />
                      <span className="meta-count">
                        {totalLessons(course.sections)}
                      </span>
                    </div>
                  </td>
                  <td className="courses-td">
                    <div className="meta-info-badge">
                      <DollarSign size={14} className="text-[#9ca3af]" />
                      <span className="price-text">
                        {course.price.toLocaleString()} ₫
                      </span>
                    </div>
                  </td>
                  <td className="courses-td">
                    <button
                      onClick={() => togglePublish(course.id)}
                      className={`status-badge ${course.active ? "active" : "draft"}`}
                    >
                      {course.active ? (
                        <>
                          <CheckCircle size={12} />
                          Đã xuất bản
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          Bản nháp
                        </>
                      )}
                    </button>
                  </td>
                  <td className="courses-td">
                    <div className="action-buttons-group">
                      <button
                        onClick={() => openEditCourse(course)}
                        title="Chỉnh sửa thông tin khóa học"
                        className="action-icon-btn edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => openManage(course)}
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
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Xóa khóa học"
                        className="action-icon-btn delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
