import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Trang chủ",
    "Khóa học",
    "Giảng viên",
    "Thống kê",
    "Liên hệ",
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white text-lg font-black">E</span>
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              EduVerse
            </h1>

            <p className="text-[11px] text-slate-400 font-medium">
              Online Learning Platform
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              className="relative text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden xl:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm khóa học..."
              className="w-[260px] h-11 rounded-full bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white outline-none transition-all pl-11 pr-4 text-sm"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Notifications */}
          <button className="relative w-11 h-11 rounded-full border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center">
            🔔
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* Chat */}
          <button className="relative w-11 h-11 rounded-full border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center">
            💬
          </button>

          {/* Login */}
          <button className="px-5 h-11 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            Đăng nhập
          </button>

          {/* Register */}
          <button className="px-6 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all">
            Đăng ký
          </button>

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            H
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`w-5 h-0.5 bg-slate-700 transition-all ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />

          <span
            className={`w-5 h-0.5 bg-slate-700 transition-all ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />

          <span
            className={`w-5 h-0.5 bg-slate-700 transition-all ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen
            ? "max-h-[600px] border-t border-slate-100 bg-white"
            : "max-h-0"
        }`}
      >
        <div className="px-6 py-5">
          {/* Search */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Tìm khóa học..."
              className="w-full h-11 rounded-2xl bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white outline-none transition-all pl-11 pr-4 text-sm"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                className="text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <button className="h-12 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
              Đăng nhập
            </button>

            <button className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200">
              Đăng ký tài khoản
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
