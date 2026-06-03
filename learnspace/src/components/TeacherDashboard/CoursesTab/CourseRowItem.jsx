import React from "react";
import { Link } from "react-router-dom";
import { Layers, ListVideo, DollarSign, Pencil, Eye, Trash2 } from "lucide-react";

const CourseRowItem = ({ course, onEdit, onManageCourse, onDelete }) => {
  return (
    <tr className="courses-tr">
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
          <span className="meta-count">{course.chapterCount}</span>
        </div>
      </td>
      <td className="courses-td">
        <div className="meta-info-badge">
          <ListVideo size={14} className="text-[#9ca3af]" />
          <span className="meta-count">{course.lessonCount}</span>
        </div>
      </td>
      <td className="courses-td">
        <div className="meta-info-badge">
          <DollarSign size={14} className="text-[#9ca3af]" />
          <span className="price-text">{course.price} VNĐ</span>
        </div>
      </td>

      <td className="courses-td">
        <div className="action-buttons-group">
          <button
            onClick={() => onEdit(course)}
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
            onClick={() => onDelete(course.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CourseRowItem;
