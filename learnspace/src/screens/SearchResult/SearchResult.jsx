import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Apis, { endpoints } from "@/configs/Apis";
import CourseCard from "../../components/CourseCard/CourseCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, categoryName } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const kw = queryParams.get("kw");

  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    categoryId,
    categoryName,
  });
  const [courses, setCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [debouncedTeacherName, setDebouncedTeacherName] = useState("");
  const [courseName, setCourseName] = useState(kw || "");
  const [debouncedCourseName, setDebouncedCourseName] = useState(kw || "");
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [priceError, setPriceError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTeacherName(teacherName);
    }, 500);
    return () => clearTimeout(timer);
  }, [teacherName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCourseName(courseName);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseName]);

  const loadCourseByCategory = async (
    catId,
    keyword,
    page = 1,
    priceFrom = priceRange.from,
    priceTo = priceRange.to,
    tName = debouncedTeacherName,
  ) => {
    try {
      setLoading(true);
      let url = `${endpoints.courses}?page=${page}`;
      if (keyword) {
        url += `&kw=${encodeURIComponent(keyword)}`;
      } else if (catId) {
        url += `&categoryId=${catId}`;
      }

      if (priceFrom) url += `&fromPrice=${priceFrom}`;
      if (priceTo) url += `&toPrice=${priceTo}`;
      if (tName) url += `&teacherName=${encodeURIComponent(tName)}`;

      const res = await Apis.get(url);
      scrollTo({ top: 0 });

      setCourses(res.data.results);
      setTotalCount(res.data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCategories = async () => {
    const res = await Apis.get(endpoints.categories);
    setCategories(res.data);
  };

  useEffect(() => {
    handleLoadCategories();
  }, []);

  useEffect(() => {
    if (debouncedCourseName) {
      setCurrentCategory({
        categoryId: null,
        categoryName: `Kết quả tìm kiếm cho: "${debouncedCourseName}"`,
      });
      loadCourseByCategory(
        null,
        debouncedCourseName,
        1,
        priceRange.from,
        priceRange.to,
        debouncedTeacherName,
      );
    } else {
      setCurrentCategory({
        categoryId,
        categoryName,
      });
      loadCourseByCategory(
        categoryId,
        null,
        1,
        priceRange.from,
        priceRange.to,
        debouncedTeacherName,
      );
    }
  }, [
    categoryId,
    categoryName,
    debouncedCourseName,
    priceRange,
    debouncedTeacherName,
  ]);

  const handlePageChange = (page) => {
    loadCourseByCategory(currentCategory.categoryId, debouncedCourseName, page);
    scrollTo({ top: 0 });
  };

  const totalPages = Math.ceil(totalCount / 20);

  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm font-semibold mb-1 tracking-wide uppercase">
            Danh mục
          </p>
          <h1 className="text-3xl font-extrabold mb-1">
            {currentCategory.categoryName || "Tất cả khóa học"}
          </h1>
          <p className="text-gray-400 text-sm">
            {courses.length} kết quả được tìm thấy
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-60 shrink-0">
          <div className="flex items-center justify-between mb-5">
            <span className="font-extrabold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-purple-600" />
              Bộ lọc
            </span>
            <button
              onClick={() => {
                setFromPrice("");
                setToPrice("");
                setTeacherName("");
                setCourseName("");
                setPriceError("");
                setPriceRange({ from: "", to: "" });
                navigate(location.pathname, { replace: true, state: {} });
              }}
              className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="mb-8">
            <div className="font-bold text-sm text-gray-800 mb-3">
              Tên khóa học
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>
          <div className="mb-8">
            <div className="font-bold text-sm text-gray-800 mb-3">
              Tên giảng viên
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <div className="mb-8">
            <div className="font-bold text-sm text-gray-800 mb-3">
              Khoảng giá
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Từ
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={fromPrice}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0 || e.target.value === "") {
                      setFromPrice(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
              <span className="text-gray-400 mt-5">-</span>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Đến
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={toPrice}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0 || e.target.value === "") {
                      setToPrice(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>
            {priceError && (
              <p className="text-red-500 text-xs mb-2 font-medium">
                {priceError}
              </p>
            )}
            <button
              onClick={() => {
                setPriceError("");
                if (
                  fromPrice !== "" &&
                  toPrice !== "" &&
                  Number(toPrice) < Number(fromPrice)
                ) {
                  setPriceError("Giá 'Đến' phải lớn hơn hoặc bằng giá 'Từ'");
                  return;
                }
                setPriceRange({ from: fromPrice, to: toPrice });
              }}
              className="w-full bg-purple-50 text-purple-700 font-semibold border border-purple-200 py-2 rounded-lg text-sm hover:bg-purple-100 transition-colors cursor-pointer"
            >
              Áp dụng
            </button>
          </div>

          <div>
            <div className="font-bold text-sm text-gray-800 mb-3">Danh mục</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setCurrentCategory({
                    categoryId: null,
                    categoryName: "Tất cả khóa học",
                  });
                  loadCourseByCategory(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer ${
                  !currentCategory.categoryId
                    ? "bg-purple-50 text-purple-700 font-semibold border border-purple-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>Tất cả khóa học</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentCategory({
                      categoryId: cat.id,
                      categoryName: cat.name,
                    });
                    loadCourseByCategory(cat.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer ${
                    cat.id === currentCategory.categoryId
                      ? "bg-purple-50 text-purple-700 font-semibold border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
              <SkeletonCard numberCards={6} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
              {courses.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500 font-medium">
                  Chưa có khóa học nào trong danh mục này
                </div>
              ) : (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    className="w-full"
                  />
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

              {pages.map(
                (page) => (
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
                ),
              )}

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
      </div>
    </div>
  );
};

export default SearchResult;
