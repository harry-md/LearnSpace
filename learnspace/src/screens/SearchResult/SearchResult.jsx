import React from "react";
import { useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Star, ChevronDown, X } from "lucide-react";
import { ShoppingCart } from "lucide-react";

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

const mockCategories = [
  { id: 1, name: "Phát triển", count: 142 },
  { id: 2, name: "Kinh doanh", count: 87 },
  { id: 3, name: "Tài chính & Kế toán", count: 65 },
  { id: 4, name: "CNTT & Phần mềm", count: 210 },
  { id: 5, name: "Năng suất văn phòng", count: 44 },
  { id: 6, name: "Phát triển cá nhân", count: 98 },
  { id: 7, name: "Thiết kế", count: 73 },
  { id: 8, name: "Marketing", count: 56 },
  { id: 9, name: "Sức khỏe & Thể dục", count: 39 },
  { id: 10, name: "Âm nhạc", count: 28 },
];

const SearchResult = () => {
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const displayPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return `${Number(price).toLocaleString("vi-VN")} ₫`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-purple-400 text-sm font-semibold mb-1 tracking-wide uppercase">
            Danh mục
          </p>
          <h1 className="text-3xl font-extrabold mb-1">
            {categoryName || "Tất cả khóa học"}
          </h1>
          <p className="text-gray-400 text-sm">
            {mockCourses.length} kết quả được tìm thấy
          </p>
          <div className="mt-5 max-w-xl relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trong danh mục này..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-purple-400 transition-all"
            />
          </div>
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
              {mockCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 cursor-pointer ${
                    cat.id === categoryId
                      ? "bg-purple-50 text-purple-700 font-semibold border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {cat.count}
                  </span>
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
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.active && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-white/95 px-2.5 py-0.5 rounded-full shadow-sm border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Đang mở
                    </span>
                  )}
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900/70 text-white">
                    {course.level}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="font-extrabold text-gray-900 text-[14px] leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {course.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.instructor}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-600">
                      {course.rating}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          className={
                            s <= Math.round(course.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      ({course.ratingCount.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span>{course.duration}</span>
                    <span>·</span>
                    <span>{course.students.toLocaleString()} học viên</span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-[16px] text-orange-600">
                        {displayPrice(course.price)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {displayPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-100 cursor-pointer active:scale-95 shrink-0"
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
