import React from "react";
import "./PaginationUI.css";

const PaginationUI = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-number-btn ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Sau
      </button>
    </div>
  );
};

export default PaginationUI;
