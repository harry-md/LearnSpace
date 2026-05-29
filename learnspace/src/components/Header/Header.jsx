import React, { useContext, useEffect, useState } from "react";
import { Search, ShoppingCart, Menu, Home, GraduationCap } from "lucide-react";
import { Chip } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const cartItems = [
  {
    id: 1,
    title: "Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày",
    author: "AI Coding",
    price: "269.000 ₫",
    originalPrice: "1.059.000 ₫",
    image: "https://placehold.co/120x68/1e3a8a/ffffff?text=Python",
  },
  {
    id: 2,
    title: "AWS Cloud for beginner (Vietnamese)",
    author: "Linh Nguyen",
    price: "269.000 ₫",
    originalPrice: "1.829.000 ₫",
    image: "https://placehold.co/120x68/f97316/ffffff?text=AWS",
  },
];

import AvatarMenu from "../AvatarMenu/AvatarMenu";
import { UIContext, UserContext, CartContext } from "@/configs/Context";
import Apis, { endpoints } from "@/configs/Apis";

const Header = () => {
  const nav = useNavigate();
  const [user] = useContext(UserContext);
  const [, uiDispatch] = useContext(UIContext);
  const [cart, cartDispatch] = useContext(CartContext);
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadSearchResults = async (keyword) => {
    try {
      const res = await Apis.get(`${endpoints.courses}?kw=${keyword}`);
      setSearchData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setSearchData([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      loadSearchResults(searchKeyword);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const loadCategories = async () => {
    try {
      uiDispatch({ type: "SHOW_LOADING" });
      const res = await Apis.get(endpoints.categories);
      setCategories(res.data);
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Không thể tải danh mục",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm w-full">
      <div className="flex items-center justify-between px-6 h-16 gap-4">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Menu className="lg:hidden cursor-pointer" />
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter cursor-pointer text-gray-900 !no-underline"
          >
            LearnSpace
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex gap-4 min-w-0">
          <div className="flex items-center min-w-0 flex-1">
            <nav className="flex items-center gap-1 ms-2">
              <Link
                to="/"
                className="group !no-underline flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 text-gray-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-200"
              >
                <Home
                  size={15}
                  strokeWidth={2.2}
                  className="transition-colors duration-200 group-hover:text-white"
                />
                <span className="transition-colors duration-200 group-hover:text-white">
                  Trang chủ
                </span>
              </Link>
              <Link
                to="/learning"
                className="group !no-underline flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 text-gray-600 hover:bg-purple-600 hover:text-white hover:shadow-md hover:shadow-purple-200"
              >
                <GraduationCap
                  size={15}
                  strokeWidth={2.2}
                  className="transition-colors duration-200 group-hover:text-white"
                />
                <span className="transition-colors duration-200 group-hover:text-white">
                  Học tập
                </span>
              </Link>
            </nav>
            <div className="flex-1 overflow-hidden min-w-0 ml-3">
              <marquee behavior="scroll" direction="left" scrollamount="4">
                <span className="text-xs font-medium text-[#1e1e1e] tracking-wide">
                  Khám phá hàng nghìn khóa học chất lượng cao &nbsp;·&nbsp; Học
                  từ các chuyên gia hàng đầu &nbsp;·&nbsp; Nâng cao kỹ năng,
                  thay đổi sự nghiệp &nbsp;·&nbsp; Ưu đãi đặc biệt dành cho
                  thành viên mới — Đăng ký ngay hôm nay! &nbsp;·&nbsp; Hơn
                  10.000 học viên đang học cùng LearnSpace
                </span>
              </marquee>
            </div>
          </div>
          <div className="max-w-3xl hidden md:block relative ml-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung bất kỳ"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {isSearchFocused && (
              <div className="absolute right-0 top-full mt-2 w-[400px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4 animate-[fadeIn_0.15s_ease-out]">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Gợi ý kết quả tìm kiếm
                </div>
                {!searchKeyword.trim() ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Nhập từ khóa để tìm kiếm khóa học...
                  </div>
                ) : !searchData || searchData.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Không tìm thấy khóa học phù hợp
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {searchData.slice(0, 5).map((course) => (
                      <Link
                        key={course.id}
                        to={`/course/${course.id}`}
                        className="flex gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors !no-underline"
                      >
                        <img
                          src={
                            course.image ||
                            "https://placehold.co/320x180/5624d0/ffffff?text=Course"
                          }
                          alt={course.name}
                          className="w-16 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[#1c1d1f] truncate">
                            {course.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {course.teacher?.fullName || "Chưa có giáo viên"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-[#1c1d1f]">
                            {course.price
                              ? `${Number(course.price).toLocaleString("vi-VN")} ₫`
                              : "Miễn phí"}
                          </div>
                          {course.avgRating && (
                            <div className="text-[10px] text-amber-500 font-semibold flex items-center justify-end gap-0.5">
                              ★ {Number(course.avgRating).toFixed(1)}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="border-t border-gray-100 mt-3 pt-3 text-center">
                  <Link
                    to={`/courses?kw=${encodeURIComponent(searchKeyword)}`}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors !no-underline"
                  >
                    Xem tất cả kết quả
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            to="/cart"
            className="relative cursor-pointer py-2 px-1 text-gray-700 hover:text-purple-600 transition-colors flex items-center"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-0.5 -right-1.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
              {cart.carts.length}
            </span>
          </Link>

          {user ? (
            <div className="relative w-10 h-10">
              <div onClick={() => setOpenAvatarMenu(!openAvatarMenu)}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all"
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all">
                    {(
                      (user.firstName && user.firstName[0]) ||
                      (user.username && user.username[0]) ||
                      "U"
                    ).toUpperCase()}
                  </div>
                )}
              </div>
              {openAvatarMenu && (
                <AvatarMenu onClose={() => setOpenAvatarMenu(false)} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="no-underline text-[#2d2f31] hover:text-purple-600 font-extrabold text-[13px] border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="no-underline bg-gray-900 text-white font-extrabold text-[13px] px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-center gap-0.5 overflow-x-auto scrollbar-hide px-6 py-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  nav("/courses", {
                    state: { categoryId: cat.id, categoryName: cat.name },
                  })
                }
                className="!no-underline flex-shrink-0 px-3 py-1 !text-xs !font-medium text-gray-500 hover:text-purple-600 transition-colors duration-150 whitespace-nowrap rounded hover:bg-purple-50"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
