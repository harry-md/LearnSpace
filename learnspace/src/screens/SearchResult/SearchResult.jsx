import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Star, ChevronDown, X } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import Apis, { endpoints } from "@/configs/Apis";
import CourseCard from "../../components/CourseCard/CourseCard";

const mockCourses = [
  {
    id: 1,
    name: "Lập Trình Python Từ Cơ Bản Đến Nâng Cao",
    instructor: "Nguyễn Văn An",
    price: 269000,
    originalPrice: 1059000,
    rating: 4.8,
    ratingCount: 1243,
    image: "https://placehold.co/320x180/1e3a8a/ffffff?text=Python",
    level: "Cơ bản",
    duration: "32 giờ",
    students: 8421,
    active: true,
  },
  {
    id: 2,
    name: "React & Next.js — Xây dựng ứng dụng thực tế",
    instructor: "Trần Thị Bích",
    price: 349000,
    originalPrice: 1299000,
    rating: 4.7,
    ratingCount: 876,
    image: "https://placehold.co/320x180/0f172a/38bdf8?text=React",
    level: "Trung cấp",
    duration: "48 giờ",
    students: 5320,
    active: true,
  },
  {
    id: 3,
    name: "AWS Cloud cho người mới bắt đầu",
    instructor: "Linh Nguyễn",
    price: 269000,
    originalPrice: 1829000,
    rating: 4.6,
    ratingCount: 654,
    image: "https://placehold.co/320x180/f97316/ffffff?text=AWS",
    level: "Cơ bản",
    duration: "24 giờ",
    students: 3210,
    active: false,
  },
  {
    id: 4,
    name: "Machine Learning với TensorFlow",
    instructor: "Dr. Minh Khoa",
    price: 0,
    originalPrice: null,
    rating: 4.9,
    ratingCount: 2301,
    image: "https://placehold.co/320x180/7c3aed/ffffff?text=ML",
    level: "Nâng cao",
    duration: "60 giờ",
    students: 12500,
    active: true,
  },
  {
    id: 5,
    name: "UI/UX Design với Figma — Từ cơ bản đến thực chiến",
    instructor: "Phan Hà Anh",
    price: 199000,
    originalPrice: 899000,
    rating: 4.5,
    ratingCount: 432,
    image: "https://placehold.co/320x180/ec4899/ffffff?text=Figma",
    level: "Cơ bản",
    duration: "28 giờ",
    students: 2870,
    active: true,
  },
  {
    id: 6,
    name: "Docker & Kubernetes cho Developer",
    instructor: "Văn Hiếu",
    price: 399000,
    originalPrice: 1499000,
    rating: 4.7,
    ratingCount: 789,
    image: "https://placehold.co/320x180/0369a1/ffffff?text=Docker",
    level: "Trung cấp",
    duration: "36 giờ",
    students: 4100,
    active: false,
  },
];

const SearchResult = () => {
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const kw = queryParams.get("kw");

  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    categoryId,
    categoryName,
  });
  const [courses, setCourses] = useState([]);

  const loadCourseByCategory = async (catId, keyword) => {
    try {
      let url = endpoints.courses;
      if (keyword) {
        url = `${endpoints.courses}?kw=${encodeURIComponent(keyword)}`;
      } else if (catId) {
        url = `${endpoints.courses}?categoryId=${catId}`;
      }
      const res = await Apis.get(url);
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoadCategories = async () => {
    const res = await Apis.get(endpoints.categories);
    setCategories(res.data);
    console.log(res.data);
  };
  const displayPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return `${Number(price).toLocaleString("vi-VN")} ₫`;
  };

  useEffect(() => {
    handleLoadCategories();
  }, []);

  useEffect(() => {
    if (kw) {
      setCurrentCategory({
        categoryId: null,
        categoryName: `Kết quả tìm kiếm cho: "${kw}"`,
      });
      loadCourseByCategory(null, kw);
    } else {
      setCurrentCategory({
        categoryId,
        categoryName,
      });
      loadCourseByCategory(categoryId);
    }
  }, [categoryId, categoryName, kw]);

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
            <button className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer">
              Xóa tất cả
            </button>
          </div>

          <div>
            <p className="font-bold text-sm text-gray-800 mb-3">Danh mục</p>
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
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Sắp xếp theo:</span>
              <button className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-full cursor-pointer">
                Đánh giá cao
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:border-purple-300 hover:text-purple-600 transition-colors cursor-pointer">
                Mới nhất
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:border-purple-300 hover:text-purple-600 transition-colors cursor-pointer">
                Giá
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500 font-medium">
                Chưa có khóa học nào trong danh mục này
              </div>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  p === 1
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
