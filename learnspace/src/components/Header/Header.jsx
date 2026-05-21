import React from "react";
import { Search, ShoppingCart, Menu, Globe, User } from "lucide-react";
import { Chip } from "@heroui/react";
import { Link } from "react-router-dom";
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

const categories = [
  "Phát triển",
  "Kinh doanh",
  "Tài chính & Kế toán",
  "CNTT & Phần mềm",
  "Năng suất văn phòng",
  "Phát triển cá nhân",
  "Thiết kế",
  "Marketing",
  "Sức khỏe & Thể dục",
  "Âm nhạc",
];

const Header = ({ showCategories = false }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm w-full">
      <div className="flex items-center justify-between px-6 h-16 gap-4">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Menu className="lg:hidden cursor-pointer" />
          <Link
            to="/home"
            className="text-3xl font-black tracking-tighter cursor-pointer text-gray-900 !no-underline"
          >
            LearnSpace
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl hidden md:block relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung bất kỳ"
            className="w-full pl-11 pr-4 py-3 bg-gray-100 border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 lg:gap-6">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="/cart" className="relative cursor-pointer py-2 px-1 text-gray-700 hover:text-purple-600 transition-colors flex items-center">
                <ShoppingCart size={22} />
                <span className="absolute -top-0.5 -right-1.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  2
                </span>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-[320px] p-0 bg-white border border-gray-200 rounded-lg shadow-xl text-left"
              side="bottom"
              align="end"
            >
              {/* Cart items */}
              <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-150">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-10 object-cover rounded border border-gray-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <a
                        href="#"
                        className="font-bold text-xs text-[#2d2f31] line-clamp-2 !no-underline hover:!text-purple-600 transition-colors"
                      >
                        {item.title}
                      </a>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {item.author}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-extrabold text-sm text-[#2d2f31]">
                          {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer summary */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm font-semibold text-gray-500">
                    Tổng cộng:
                  </span>
                  <span className="text-lg font-black text-[#2d2f31]">
                    538.000 ₫
                  </span>
                </div>
                <Link to="/cart" className="w-full block no-underline">
                  <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg text-sm transition-colors text-center cursor-pointer">
                    Chuyển đến giỏ hàng
                  </button>
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold cursor-pointer hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all">
                U
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-[280px] p-0 bg-white border border-gray-200 rounded-lg shadow-xl"
              side="bottom"
              align="end"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 text-gray-900">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm shrink-0">
                  <User size={20} className="text-white" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-sm text-[#2d2f31]">
                    Udemy User
                  </h4>
                  <p
                    className="text-xs text-gray-500 truncate"
                    title="hau13032005@outlook.com"
                  >
                    hau13032005@outlook.com
                  </p>
                </div>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 1 */}
              <div className="py-1.5 font-normal">
                <Link
                  to="/learning"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Học tập
                </Link>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-purple-600 bg-purple-50/30 hover:!bg-purple-50 hover:!text-purple-700 transition-colors font-medium !no-underline"
                >
                  Giỏ hàng của tôi
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Danh sách mong ước
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Giảng dạy trên Udemy
                </a>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 2 */}
              <div className="py-1.5 font-normal">
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Thông báo.
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Tin nhắn
                </a>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 3 */}
              <div className="py-1.5 font-normal">
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Cài đặt tài khoản
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Phương thức thanh toán
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Thuê bao
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Ưu đãi Udemy
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Lịch sử mua
                </a>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 4 */}
              <div className="py-1.5 font-normal">
                <div className="flex items-center justify-between py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors cursor-pointer">
                  <span>Ngôn ngữ</span>
                  <span className="flex items-center gap-1 font-semibold !text-gray-800">
                    Tiếng Việt <Globe size={14} />
                  </span>
                </div>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 5 */}
              <div className="py-1.5 font-normal">
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Hồ sơ công khai
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Chỉnh sửa hồ sơ
                </a>
              </div>

              <hr className="border-gray-150 m-0" />

              {/* Section 6 */}
              <div className="py-1.5 font-normal">
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Trợ giúp và Hỗ trợ
                </a>
                <a
                  href="#"
                  className="block py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
                >
                  Đăng xuất
                </a>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {showCategories && (
        <div className="hidden lg:flex items-center gap-3 py-3 border-t border-gray-100 bg-white overflow-x-auto px-6 scrollbar-hide">
          {categories.map((category, index) => (
            <Chip
              key={index}
              className="cursor-pointer whitespace-nowrap px-4 py-2 border border-gray-200 rounded-full text-gray-700 bg-white transition-all duration-300 hover:!bg-purple-600 hover:!border-purple-600 hover:!text-white hover:shadow-md hover:-translate-y-1"
            >
              {category}
            </Chip>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
