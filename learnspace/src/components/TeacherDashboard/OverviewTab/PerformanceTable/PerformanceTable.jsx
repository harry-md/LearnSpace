import React from "react";
import { TrendingUp } from "lucide-react";
import PerformanceTableRow from "./PerformanceTableRow";
import PaginationUI from "../../PaginationUI/PaginationUI";
import "./PerformanceTable.css";

const PerformanceTable = ({
  teacherCourses,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="performance-table-wrapper">
      <div className="performance-table-header">
        <TrendingUp size={20} className="text-[#8b5cf6]" />
        <h2 className="performance-table-title">
          Phân tích hiệu suất khóa học
        </h2>
      </div>
      <div className="performance-table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Học viên</th>
              <th>Đánh giá</th>
              <th>Doanh thu (Ước tính)</th>
            </tr>
          </thead>
          <tbody>
            {teacherCourses.map((course) => (
              <PerformanceTableRow key={course.id} course={course} />
            ))}
            {teacherCourses.length === 0 && (
              <tr>
                <td colSpan="4" className="performance-empty">
                  Chưa có khóa học nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="performance-pagination">
          <PaginationUI
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default PerformanceTable;
