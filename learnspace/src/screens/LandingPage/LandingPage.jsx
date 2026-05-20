import { useState, useEffect, useRef } from "react";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Counter({ target, suffix = "", duration = 1400 }) {
  const [ref, visible] = useReveal(0.5);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useReveal();
  const base = "transition-all duration-700 ease-out";
  const hidden =
    direction === "up"
      ? "opacity-0 translate-y-10"
      : direction === "left"
        ? "opacity-0 -translate-x-10"
        : direction === "right"
          ? "opacity-0 translate-x-10"
          : "opacity-0 scale-95";
  const shown = "opacity-100 translate-y-0 translate-x-0 scale-100";
  return (
    <div
      ref={ref}
      className={`${base} ${visible ? shown : hidden} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

const COURSES = [
  {
    emoji: "⚡",
    cat: "Lập Trình",
    name: "Full-Stack Web Development với React & Node.js",
    rating: 4.9,
    hours: 32,
    students: "2.4K",
    price: "1.299.000₫",
    old: "2.500.000₫",
    badge: "Bestseller",
    bg: "from-blue-50 to-indigo-100",
    accent: "text-indigo-600",
  },
  {
    emoji: "🤖",
    cat: "AI & Machine Learning",
    name: "AI Thực Chiến — Xây Dựng Sản Phẩm AI Từ Đầu",
    rating: 4.8,
    hours: 28,
    students: "1.8K",
    price: "1.499.000₫",
    old: "3.000.000₫",
    badge: "Mới",
    bg: "from-violet-50 to-purple-100",
    accent: "text-purple-600",
  },
  {
    emoji: "🎨",
    cat: "UI/UX Design",
    name: "UI/UX Design Masterclass — Figma đến Prototype",
    rating: 4.9,
    hours: 24,
    students: "3.2K",
    price: "999.000₫",
    old: "2.000.000₫",
    badge: "Hot",
    bg: "from-pink-50 to-rose-100",
    accent: "text-rose-600",
  },
  {
    emoji: "📊",
    cat: "Data Science",
    name: "Data Science với Python — Phân Tích đến Dự Báo",
    rating: 4.7,
    hours: 36,
    students: "1.6K",
    price: "1.199.000₫",
    old: "2.400.000₫",
    badge: null,
    bg: "from-teal-50 to-cyan-100",
    accent: "text-teal-600",
  },
  {
    emoji: "📱",
    cat: "Mobile Dev",
    name: "React Native — Xây App Mobile iOS & Android",
    rating: 4.8,
    hours: 26,
    students: "980",
    price: "1.099.000₫",
    old: "2.200.000₫",
    badge: null,
    bg: "from-orange-50 to-amber-100",
    accent: "text-amber-600",
  },
  {
    emoji: "🚀",
    cat: "Kinh Doanh",
    name: "Digital Marketing — Chiến Lược Tăng Trưởng 0→1",
    rating: 4.6,
    hours: 20,
    students: "2.1K",
    price: "799.000₫",
    old: "1.600.000₫",
    badge: null,
    bg: "from-green-50 to-emerald-100",
    accent: "text-emerald-600",
  },
];

const INSTRUCTORS = [
  {
    emoji: "👨‍💻",
    name: "Minh Trí",
    role: "Senior Engineer @ Google",
    courses: 12,
    students: "8.4K",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    emoji: "👩‍🎨",
    name: "Lan Phương",
    role: "Product Designer @ Grab",
    courses: 8,
    students: "6.1K",
    bg: "bg-pink-100",
    text: "text-pink-700",
  },
  {
    emoji: "👨‍🔬",
    name: "Hoàng Nam",
    role: "Data Scientist @ VNG",
    courses: 9,
    students: "5.2K",
    bg: "bg-teal-100",
    text: "text-teal-700",
  },
  {
    emoji: "👩‍💼",
    name: "Thu Hà",
    role: "CMO @ MoMo",
    courses: 7,
    students: "7.8K",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "Sau 3 tháng học Full-Stack, mình đã tìm được công việc lập trình đầu tiên với mức lương 15 triệu/tháng. Nội dung thực tế, giảng viên nhiệt tình!",
    name: "Nguyễn Văn Khoa",
    title: "Junior Developer tại FPT",
    emoji: "🧑",
    featured: true,
  },
  {
    stars: 5,
    text: "Khóa UI/UX đã thay đổi hoàn toàn cách mình nhìn nhận thiết kế. Portfolio sau khóa học giúp mình được nhận vào Grab chỉ sau 2 tháng.",
    name: "Trần Thị Mai Anh",
    title: "UX Designer tại Grab",
    emoji: "👩",
    featured: false,
  },
  {
    stars: 4,
    text: "Khóa Data Science rất cụ thể và thực hành. Sau khi học xong, mình tự tin phỏng vấn vị trí Data Analyst và đã pass được vòng technical.",
    name: "Lê Quốc Bảo",
    title: "Data Analyst tại Tiki",
    emoji: "🧑",
    featured: false,
  },
];

const PLANS = [
  {
    tier: "Starter",
    price: "Miễn phí",
    period: "Mãi mãi",
    features: [
      "10 khóa học miễn phí",
      "Video chất lượng HD",
      "Forum cộng đồng",
    ],
    off: ["Chứng chỉ hoàn thành", "Download tài liệu", "Mentor 1-1"],
    popular: false,
  },
  {
    tier: "Pro",
    price: "299K",
    period: "/ tháng",
    features: [
      "Toàn bộ 200+ khóa học",
      "Video 4K + phụ đề",
      "Chứng chỉ hoàn thành",
      "Download tài liệu offline",
      "Forum ưu tiên",
    ],
    off: ["Mentor 1-1 hàng tuần"],
    popular: true,
  },
  {
    tier: "Premium",
    price: "599K",
    period: "/ tháng",
    features: [
      "Mọi tính năng của Pro",
      "Mentor 1-1 hàng tuần",
      "Review CV & Portfolio",
      "Kết nối nhà tuyển dụng",
      "Lộ trình AI cá nhân hóa",
      "Hỗ trợ Zalo riêng",
    ],
    off: [],
    popular: false,
  },
];

const MARQUEE_ITEMS = [
  "Web Development",
  "AI & Machine Learning",
  "UI/UX Design",
  "Data Science",
  "Mobile Apps",
  "Digital Marketing",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "Product Management",
];

// ── Navbar ──────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Edu<span className="text-indigo-600 italic font-black">Verse</span>
        </span>
        <div className="hidden md:flex items-center gap-8">
          {[
            ["courses", "Khóa Học"],
            ["why", "Tại Sao Chọn"],
            ["instructors", "Giảng Viên"],
            ["pricing", "Học Phí"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full transition-colors">
            Đăng nhập
          </button>
          <button
            onClick={() => scrollTo("pricing")}
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
          >
            Bắt Đầu Ngay
          </button>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <div
            className={`w-5 h-0.5 bg-slate-700 mb-1 transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <div
            className={`w-5 h-0.5 bg-slate-700 mb-1 transition-all ${mobileOpen ? "opacity-0" : ""}`}
          />
          <div
            className={`w-5 h-0.5 bg-slate-700 transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-3">
          {[
            ["courses", "Khóa Học"],
            ["why", "Tại Sao Chọn"],
            ["instructors", "Giảng Viên"],
            ["pricing", "Học Phí"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left text-sm font-medium text-slate-700 py-2"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("pricing")}
            className="mt-2 text-sm font-semibold bg-indigo-600 text-white py-3 rounded-xl"
          >
            Bắt Đầu Ngay
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/60"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100/40 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div
            className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8"
            style={{ animation: "fadeSlideUp 0.8s 0.1s both" }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Nền tảng học trực tuyến #1 Việt Nam
            </span>
          </div>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900 mb-6"
            style={{ animation: "fadeSlideUp 0.9s 0.2s both" }}
          >
            Học Thật,
            <br />
            <span className="text-indigo-600 italic">Làm Được.</span>
            <br />
            Thành Công.
          </h1>
          <p
            className="text-lg text-slate-500 leading-relaxed max-w-md mb-10"
            style={{ animation: "fadeSlideUp 0.9s 0.35s both" }}
          >
            Hơn 200+ khóa học chuyên sâu từ các chuyên gia hàng đầu — học xong
            là có thể ứng dụng ngay trong công việc.
          </p>
          <div
            className="flex flex-wrap gap-3 mb-14"
            style={{ animation: "fadeSlideUp 0.9s 0.5s both" }}
          >
            <button
              onClick={() =>
                document
                  .getElementById("courses")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 text-sm"
            >
              Khám Phá Khóa Học →
            </button>
            <button className="px-7 py-3.5 border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 active:scale-95 transition-all text-sm flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                ▶
              </span>
              Xem Giới Thiệu
            </button>
          </div>
          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 pt-8 border-t border-slate-100"
            style={{ animation: "fadeSlideUp 0.9s 0.65s both" }}
          >
            {[
              ["48K+", 48, "K+", "Học viên"],
              ["200+", 200, "+", "Khóa học"],
              ["96%", 96, "%", "Hài lòng"],
              ["50+", 50, "+", "Giảng viên"],
            ].map(([, num, suf, label]) => (
              <div key={label}>
                <div className="text-2xl font-black text-slate-900">
                  <Counter target={num} suffix={suf} />
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-wide">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — floating cards visual */}
        <div
          className="hidden md:block relative h-[520px]"
          style={{ animation: "fadeSlideUp 1s 0.3s both" }}
        >
          {/* Main card */}
          <div className="absolute top-8 left-4 right-4 bg-white rounded-3xl shadow-xl shadow-slate-200/80 p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Full-Stack React & Node.js
                </div>
                <div className="text-xs text-slate-400">
                  32 giờ học · 2,400 học viên
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Tiến độ</span>
                <span>68%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500 w-[68%]"
                  style={{ animation: "growWidth 1.5s 1.2s both ease-out" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {["Module 1", "Module 2", "Module 3"].map((m, i) => (
                <div
                  key={m}
                  className={`rounded-xl p-2.5 text-center text-xs font-semibold ${i < 2 ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"}`}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Achievement badge */}
          <div
            className="absolute top-[210px] right-0 bg-white rounded-2xl shadow-lg shadow-slate-200 p-4 border border-slate-100 flex items-center gap-3"
            style={{ animation: "floatY 4s ease-in-out infinite" }}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-content-center text-lg flex items-center justify-center">
              🏆
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                Hoàn thành khóa học!
              </div>
              <div className="text-xs text-amber-500 font-semibold">
                +500 điểm XP
              </div>
            </div>
          </div>

          {/* Rating mini card */}
          <div
            className="absolute bottom-[100px] left-0 bg-white rounded-2xl shadow-lg shadow-slate-200 p-3.5 border border-slate-100"
            style={{ animation: "floatY 5s 1s ease-in-out infinite" }}
          >
            <div className="text-xs text-slate-500 mb-1">
              Đánh giá trung bình
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">4.9</span>
              <span className="text-amber-400 text-sm">★★★★★</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Từ 12,500+ đánh giá
            </div>
          </div>

          {/* Instructor mini */}
          <div
            className="absolute bottom-8 right-2 left-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white"
            style={{ animation: "floatY 4.5s 0.5s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base">
                👨‍💻
              </div>
              <div>
                <div className="text-xs font-bold">
                  Minh Trí · Google Engineer
                </div>
                <div className="text-xs text-indigo-200">
                  Trả lời trong vòng 2 giờ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes growWidth { from { width:0; } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
      `}</style>
    </section>
  );
}

// ── Marquee ─────────────────────────────────────────────────────
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="bg-indigo-600 py-4 overflow-hidden">
      <div
        className="flex w-max"
        style={{ animation: "marqueeX 28s linear infinite" }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 whitespace-nowrap"
          >
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              {t}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
          </div>
        ))}
      </div>
      <style>{`@keyframes marqueeX { from { transform:translateX(0); } to { transform:translateX(-50%); } }`}</style>
    </div>
  );
}

// ── Courses ─────────────────────────────────────────────────────
function CourseCard({ course, delay }) {
  return (
    <Reveal delay={delay} direction="up">
      <div className="group bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
        <div
          className={`h-44 bg-gradient-to-br ${course.bg} flex items-center justify-center relative`}
        >
          <span className="text-5xl">{course.emoji}</span>
          {course.badge && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-white rounded-full px-3 py-1 text-slate-700 shadow-sm">
              {course.badge}
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div
            className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${course.accent}`}
          >
            {course.cat}
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-snug mb-3 flex-1">
            {course.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="text-amber-500 font-bold">★ {course.rating}</span>
            <span>·</span>
            <span>{course.hours}h</span>
            <span>·</span>
            <span>{course.students} học viên</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div>
              <span className="font-black text-slate-900 text-sm">
                {course.price}
              </span>
              <span className="text-xs text-slate-300 line-through ml-1.5">
                {course.old}
              </span>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Courses() {
  return (
    <section id="courses" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Danh Mục Nổi Bật
          </span>
        </Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mt-3">
              Khóa học được
              <br />
              <span className="text-indigo-600 italic">yêu thích nhất</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <button
              onClick={() => {}}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors shrink-0"
            >
              Xem tất cả →
            </button>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.map((c, i) => (
            <CourseCard key={i} course={c} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why ─────────────────────────────────────────────────────────
function Why() {
  const features = [
    {
      icon: "🎓",
      title: "Học từ chuyên gia thực chiến",
      desc: "Giảng viên đến từ Google, VNG, MoMo, Tiki, Grab...",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: "⚡",
      title: "Lộ trình AI cá nhân hóa",
      desc: "AI đề xuất lộ trình phù hợp với mục tiêu và thời gian của bạn.",
      color: "bg-violet-50 text-violet-600",
    },
    {
      icon: "🏆",
      title: "Chứng chỉ được công nhận",
      desc: "Hơn 500+ doanh nghiệp tin tưởng và chấp nhận chứng chỉ EduVerse.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: "💬",
      title: "Forum hỗ trợ 24/7",
      desc: "Câu hỏi được trả lời trong vòng 2 giờ bởi mentor và cộng đồng.",
      color: "bg-teal-50 text-teal-600",
    },
    {
      icon: "🎯",
      title: "Dự án portfolio thực tế",
      desc: "CV của bạn sẽ nổi bật ngay lập tức với các dự án thực chiến.",
      color: "bg-rose-50 text-rose-600",
    },
    {
      icon: "♾️",
      title: "Truy cập trọn đời",
      desc: "Học mãi mãi, cập nhật nội dung mới miễn phí không giới hạn.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];
  return (
    <section id="why" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Vì Sao EduVerse?
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3 leading-tight">
              Không chỉ học —<br />
              <span className="text-indigo-600 italic">mà làm được.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Mỗi khóa học được thiết kế với dự án thực tế, mentor 1-1, và cộng
              đồng hỗ trợ mạnh mẽ.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 70} direction="up">
              <div className="group p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-400 hover:-translate-y-1 bg-white">
                <div
                  className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-xl mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust bar */}
        <Reveal delay={200}>
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl p-8 flex flex-wrap items-center justify-between gap-6 border border-indigo-100">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-700">
                <Counter target={30} suffix="%" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Hoàn tiền nếu không hài lòng
              </div>
            </div>
            <div className="w-px h-12 bg-indigo-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-700">
                <Counter target={48} suffix="K+" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Học viên tin tưởng
              </div>
            </div>
            <div className="w-px h-12 bg-indigo-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-700">
                <Counter target={500} suffix="+" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Doanh nghiệp công nhận
              </div>
            </div>
            <div className="w-px h-12 bg-indigo-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-700">
                <Counter target={96} suffix="%" />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Tỷ lệ hoàn thành khóa học
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Instructors ─────────────────────────────────────────────────
function Instructors() {
  return (
    <section id="instructors" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Đội Ngũ Giảng Viên
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
              Học từ người
              <br />
              <span className="text-indigo-600 italic">đang làm việc đó</span>
            </h2>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INSTRUCTORS.map((inst, i) => (
            <Reveal key={i} delay={i * 100} direction="up">
              <div className="group bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/70 transition-all duration-400 hover:-translate-y-2 p-6 text-center">
                <div
                  className={`w-20 h-20 rounded-3xl ${inst.bg} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-105 transition-transform`}
                >
                  {inst.emoji}
                </div>
                <div className="font-black text-slate-900 mb-1">
                  {inst.name}
                </div>
                <div className={`text-xs font-semibold ${inst.text} mb-3`}>
                  {inst.role}
                </div>
                <div className="flex justify-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-50">
                  <span>{inst.courses} khóa học</span>
                  <span>·</span>
                  <span>{inst.students} học viên</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Học Viên Nói Gì
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
              Kết quả thực tế
              <br />
              <span className="text-indigo-600 italic">từ người thực</span>
            </h2>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className={`h-full rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col
                ${
                  t.featured
                    ? "bg-indigo-600 border-indigo-500 text-white hover:shadow-indigo-200"
                    : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-slate-100"
                }`}
              >
                <div
                  className={`text-sm mb-4 ${t.featured ? "text-indigo-200" : "text-amber-400"}`}
                >
                  {"★".repeat(t.stars)}
                  {"☆".repeat(5 - t.stars)}
                </div>
                <p
                  className={`text-sm leading-relaxed flex-1 mb-6 italic ${t.featured ? "text-indigo-100" : "text-slate-500"}`}
                >
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                    ${t.featured ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${t.featured ? "text-white" : "text-slate-800"}`}
                    >
                      {t.name}
                    </div>
                    <div
                      className={`text-xs ${t.featured ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      {t.title}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Học Phí
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
              Đầu tư vào bản thân —<br />
              <span className="text-indigo-600 italic">không bao giờ lỗ</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-slate-500 mt-4">
              Chọn gói phù hợp. Tất cả đều có hoàn tiền trong 30 ngày.
            </p>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <Reveal key={i} delay={i * 100} direction="up">
              <div
                className={`relative rounded-3xl border p-7 flex flex-col h-full transition-all duration-400 hover:-translate-y-2
                ${
                  plan.popular
                    ? "bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-200/60 scale-[1.03]"
                    : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Phổ biến nhất
                  </div>
                )}
                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.popular ? "text-indigo-200" : "text-indigo-600"}`}
                >
                  {plan.tier}
                </div>
                <div
                  className={`text-4xl font-black mb-1 ${plan.popular ? "text-white" : "text-slate-900"}`}
                >
                  {plan.price}
                </div>
                <div
                  className={`text-sm mb-8 ${plan.popular ? "text-indigo-200" : "text-slate-400"}`}
                >
                  {plan.period}
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 text-xs flex-shrink-0 ${plan.popular ? "text-indigo-200" : "text-indigo-500"}`}
                      >
                        ✓
                      </span>
                      <span
                        className={
                          plan.popular ? "text-indigo-100" : "text-slate-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                  {plan.off.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 text-xs flex-shrink-0 ${plan.popular ? "text-indigo-400" : "text-slate-300"}`}
                      >
                        ×
                      </span>
                      <span
                        className={
                          plan.popular ? "text-indigo-400" : "text-slate-300"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-all
                  ${
                    plan.popular
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
                      : "border border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100"
                  }`}
                >
                  {plan.tier === "Starter"
                    ? "Bắt Đầu Miễn Phí"
                    : `Đăng Ký ${plan.tier}`}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">
                Sẵn Sàng Chưa?
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Bắt đầu hành trình
                <br />
                <span className="text-indigo-200 italic">của bạn hôm nay</span>
              </h2>
              <p className="text-indigo-200 mb-10 max-w-md mx-auto text-base">
                Hơn 48,000 học viên đã thay đổi sự nghiệp với EduVerse. Bạn là
                người tiếp theo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 active:scale-95 transition-all shadow-xl text-sm"
                >
                  Bắt Đầu Học Ngay →
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("courses")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 border border-indigo-400 text-white font-semibold rounded-full hover:bg-white/10 active:scale-95 transition-all text-sm"
                >
                  Xem Tất Cả Khóa Học
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-2xl font-black text-white mb-4">
              Edu<span className="text-indigo-400 italic">Verse</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng học trực tuyến hàng đầu Việt Nam — kết nối người học với
              kiến thức thực chiến.
            </p>
          </div>
          {[
            {
              title: "Khóa Học",
              links: [
                "Lập trình Web",
                "AI & Machine Learning",
                "UI/UX Design",
                "Data Science",
                "Digital Marketing",
              ],
            },
            {
              title: "Công Ty",
              links: [
                "Về EduVerse",
                "Đội ngũ giảng viên",
                "Blog",
                "Tuyển dụng",
                "Liên hệ",
              ],
            },
            {
              title: "Hỗ Trợ",
              links: [
                "Trung tâm trợ giúp",
                "Chính sách hoàn tiền",
                "Điều khoản",
                "Bảo mật",
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© 2024 EduVerse. Được làm với ❤ tại Việt Nam.</span>
          <span className="flex gap-4">
            {["Facebook", "YouTube", "Zalo", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="hover:text-white transition-colors"
              >
                {s}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

function ScrollUtils() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const handler = () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      setProgress(pct);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <>
      <div
        className="fixed top-0 left-0 h-0.5 bg-indigo-500 z-50 transition-all"
        style={{ width: `${progress}%` }}
      />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-90 transition-all duration-300 text-sm font-bold ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Lên đầu trang"
      >
        ↑
      </button>
    </>
  );
}

export default function LandingPage() {
  return (
    <div className="antialiased">
      <ScrollUtils />
      <Navbar />
      <Hero />
      <Marquee />
      <Courses />
      <Why />
      <Instructors />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
