import React from "react";
import { Users, Star } from "lucide-react";

const PerformanceTableRow = ({ course }) => {
  const revenue = (course.price || 0) * (course.enrollmentCount || 0);

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <img
            src={
              course.image ||
              `https://placehold.co/100x56/5624d0/ffffff?text=${course.name}`
            }
            alt={course.name}
            className="performance-course-img"
          />
          <span className="performance-course-name">{course.name}</span>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2 font-medium">
          <Users size={16} className="text-[#10b981]" />
          {course.enrollmentCount || 0}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2 font-medium">
          <Star
            size={16}
            className={
              course.avgRating
                ? "text-[#f59e0b] fill-[#f59e0b]"
                : "text-[#d1d5db]"
            }
          />
          {course.avgRating ? Number(course.avgRating).toFixed(1) : "Chưa có"}
        </div>
      </td>
      <td className="performance-revenue">
        <span className="performance-revenue-text">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(revenue)}
        </span>
      </td>
    </tr>
  );
};

export default PerformanceTableRow;
