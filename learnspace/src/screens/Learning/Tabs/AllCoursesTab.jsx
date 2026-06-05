import React, { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Apis, { endpoints } from "@/configs/Apis";
import { UIContext } from "@/configs/Context";
import CourseCard from "@/components/CourseCard/CourseCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

const AllCoursesTab = () => {
  const [course, setCourse] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [, uiDispatch] = useContext(UIContext);

  const loadAllCourse = async (page = 1) => {
    setLoading(true);
    try {
      const res = await Apis.get(`${endpoints.courses}?page=${page}`);
      if (res.status === 200) {
        setCourse(res.data.results);
        setTotalCount(res.data.count);
        setCurrentPage(page);
      }
    } catch (err) {
      uiDispatch({
        type: "SHOW_TOAST",
        message: "Lỗi hệ thống",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCourse();
  }, []);

  const handlePageChange = (page) => {
    loadAllCourse(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <h3 className="text-lg font-bold text-[#1c1d1f] mb-6">Tất cả khóa học</h3>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonCard numberCards={8} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {course.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 font-medium">
              Chưa có khóa học nào
            </div>
          ) : (
            course.map((item) => (
              <CourseCard key={item.id} course={item} className="w-full" />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold ${
                currentPage === page
                  ? "bg-purple-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCoursesTab;
