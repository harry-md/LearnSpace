import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";

const Header = ({ view, selectedCourse, onBackToCourses }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {view === "manage" && (
          <button
            onClick={onBackToCourses}
            className="flex items-center gap-1.5 text-purple-500 font-bold text-sm cursor-pointer border-none bg-transparent p-0 hover:text-purple-600 transition-colors"
          >
            <BookOpen size={15} /> Khóa học
          </button>
        )}
        {view === "manage" && (
          <ChevronRight size={14} className="text-gray-400" />
        )}
        <h1 className="!text-[20px] !font-black text-[#1c1d1f] ms-5">
          {view === "overview" && "Tổng quan"}
          {view === "courses" && "Khóa học của tôi"}
          {view === "manage" && (
            <span className="truncate max-w-[320px] inline-block align-bottom">
              {selectedCourse?.name || selectedCourse?.title}
            </span>
          )}
        </h1>
      </div>
    </header>
  );
};

export default Header;
