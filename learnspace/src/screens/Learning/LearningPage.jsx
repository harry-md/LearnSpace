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
