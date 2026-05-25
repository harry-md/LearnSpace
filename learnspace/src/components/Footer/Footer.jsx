import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#1c1d1f] text-white py-12 px-6 md:px-12 border-t border-gray-800 shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8 mb-8">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            Giảng dạy online cho cả thế giới
          </h3>
          <p className="text-sm text-gray-400">
            Tạo một khóa học video online, tiếp cận học viên trên toàn cầu và kiếm tiền
          </p>
        </div>
        <button className="px-6 py-3 border border-white hover:bg-white/10 active:scale-95 transition-all text-sm font-extrabold text-white cursor-pointer shrink-0">
          Giảng dạy trên Udemy
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="text-lg font-black text-white tracking-tighter">
          LearnSpace
        </div>
        <div>© 2026 LearnSpace, Inc.</div>
      </div>
    </footer>
  );
};

export default Footer;
