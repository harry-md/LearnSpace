import React, { useState } from "react";
import AllCoursesTab from "./Tabs/AllCoursesTab";
import MyListsTab from "./Tabs/MyListsTab";

const LearningPage = () => {
  const [activeTab, setActiveTab] = useState("my_course");

  return (
    <div className="min-h-screen bg-[#f7f9fa] font-sans text-gray-900 flex flex-col">
      <section className="bg-[#1c1d1f] text-white pt-8 px-6 md:px-12 border-b border-gray-800 shrink-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight mb-8">
            Học tập
          </h2>

          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none pb-0">
            <button
              onClick={() => setActiveTab("all_course")}
              className={`pb-3 text-sm md:text-base font-bold whitespace-nowrap border-b-[3px] transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "all_course"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Tất cả khóa học
            </button>
            <button
              onClick={() => setActiveTab("my_course")}
              className={`pb-3 text-sm md:text-base font-bold whitespace-nowrap border-b-[3px] transition-all duration-300 cursor-pointer outline-none ${
                activeTab === "my_course"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Khóa học của tôi
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:px-12">
        {activeTab === "all_course" && <AllCoursesTab />}
        {activeTab === "my_course" && <MyListsTab />}
      </main>

      <footer className="bg-[#1c1d1f] text-white pt-10 pb-6 px-6 md:px-12 mt-auto shrink-0 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8">
          <div>
            <h4 className="text-lg font-black text-white tracking-tight">
              Giảng dạy online cho cả thế giới
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Đăng ký trở thành giảng viên trên LearnSpace, chia sẻ kiến thức
              của bạn với hàng triệu học viên toàn cầu và kiến tạo thêm nguồn
              thu nhập ổn định.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-transparent border border-white hover:bg-white/10 text-white font-bold text-sm transition-colors cursor-pointer shrink-0">
            Giảng dạy trên LearnSpace
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-6 text-[11px] text-gray-400 font-medium">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start">
            <span className="hover:underline cursor-pointer">
              Điều khoản dịch vụ
            </span>
            <span className="hover:underline cursor-pointer">
              Chính sách bảo mật
            </span>
            <span className="hover:underline cursor-pointer">
              Trợ giúp &amp; Hỗ trợ
            </span>
            <span className="hover:underline cursor-pointer">
              Liên hệ chúng tôi
            </span>
          </div>
          <span>© 2026 LearnSpace, Inc. All rights reserved.</span>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LearningPage;
