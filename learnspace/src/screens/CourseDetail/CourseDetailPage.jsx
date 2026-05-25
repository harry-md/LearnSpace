import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Monitor,
  FileText,
  Infinity,
  Trophy,
  Globe,
  Star,
  StarHalf,
  Clock,
  BarChart,
  Users,
  Heart,
  ShoppingCart,
} from "lucide-react";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseHoverDetail from "../../components/CourseHoverDetail/CourseHoverDetail";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const COURSE = {
  id: 123,
  title: "Cấu trúc dữ liệu & Giải thuật trong Python – Luyện LeetCode từ 0 đến 1000 bài",
  subtitle:
    "Học Cấu trúc dữ liệu & Giải thuật bằng Python, giải hơn 150 bài LeetCode từ Easy đến Hard cùng giải thích chi tiết và tư duy tiếp cận.",
  rating: 4.7,
  ratingCount: "2.134",
  studentsCount: "15.800",
  author: "Nguyễn Minh Trí",
  authorTitle: "Senior Software Engineer @ Google",
  updatedDate: "05/2026",
  language: "Tiếng Việt",
  level: "Trung cấp đến Nâng cao",
  totalHours: 42.5,
  lectures: 387,
  image: "https://placehold.co/640x360/1e293b/facc15?text=DSA+Python",
  price: "499.000 ₫",
  originalPrice: "1.999.000 ₫",
  badges: ["Bán chạy nhất"],
  description:
    "Đây là khóa học toàn diện nhất về Cấu trúc dữ liệu & Giải thuật bằng Python tại Việt Nam. Khóa học được thiết kế từ cơ bản đến nâng cao, giúp bạn nắm vững các khái niệm cốt lõi và áp dụng ngay vào luyện tập LeetCode – nền tảng phỏng vấn kỹ thuật hàng đầu thế giới. Mỗi chủ đề đều có bài giảng lý thuyết súc tích, kèm giải bài chi tiết với nhiều cách tiếp cận từ Brute Force đến tối ưu O(n) hay O(1).",
  objectives: [
    "Nắm vững Array, LinkedList, Stack, Queue, HashMap, Tree, Graph, Heap",
    "Thành thạo các thuật toán sắp xếp, tìm kiếm kinh điển",
    "Giải 150+ bài LeetCode từ Easy đến Hard có giải thích",
    "Tư duy tiếp cận bài toán theo template chuẩn phỏng vấn FAANG",
    "Hiểu và phân tích độ phức tạp O(n) chính xác",
    "Áp dụng Two Pointers, Sliding Window, BFS/DFS, Dynamic Programming",
    "Thực hành Backtracking, Binary Search, Divide & Conquer",
    "Chuẩn bị tự tin cho buổi phỏng vấn kỹ thuật tại các công ty lớn",
  ],
  requirements: [
    "Biết lập trình Python cơ bản (biến, vòng lặp, hàm, list)",
    "Không cần kiến thức về thuật toán trước đó",
    "Máy tính có cài Python 3.x hoặc dùng Google Colab miễn phí",
  ],
  sections: [
    {
      id: 1,
      title: "Giới thiệu & Cài đặt môi trường",
      lectures: 5,
      duration: "45 phút",
      lessons: [
        { title: "Giới thiệu khóa học và lộ trình học", duration: "8:32", free: true },
        { title: "Cài đặt Python, VS Code và Jupyter Notebook", duration: "12:15", free: true },
        { title: "Làm quen với LeetCode – Hướng dẫn submit bài", duration: "7:44", free: false },
        { title: "Phân tích độ phức tạp Big-O: Lý thuyết & Ví dụ", duration: "14:20", free: false },
        { title: "Tổng quan các CTDL & Giải thuật sẽ học", duration: "3:10", free: false },
      ],
    },
    {
      id: 2,
      title: "Array & Hashing",
      lectures: 28,
      duration: "4 giờ 15 phút",
      lessons: [
        { title: "Array cơ bản – Truy cập, duyệt, cập nhật", duration: "18:05", free: false },
        { title: "Two Sum – Bài kinh điển số 1 LeetCode", duration: "22:30", free: false },
        { title: "Contains Duplicate – 3 cách giải", duration: "15:44", free: false },
        { title: "Group Anagrams – HashMap approach", duration: "19:12", free: false },
      ],
    },
    {
      id: 3,
      title: "Two Pointers",
      lectures: 15,
      duration: "2 giờ 30 phút",
      lessons: [
        { title: "Template Two Pointers chuẩn phỏng vấn", duration: "11:20", free: false },
        { title: "Valid Palindrome", duration: "9:55", free: false },
        { title: "3Sum – Giải O(n²) không cần brute force", duration: "25:40", free: false },
      ],
    },
    {
      id: 4,
      title: "Sliding Window",
      lectures: 12,
      duration: "2 giờ 10 phút",
      lessons: [
        { title: "Template Sliding Window cơ bản và nâng cao", duration: "16:33", free: false },
        { title: "Best Time to Buy and Sell Stock", duration: "12:10", free: false },
      ],
    },
    {
      id: 5,
      title: "Stack & Queue",
      lectures: 18,
      duration: "3 giờ 05 phút",
      lessons: [
        { title: "Stack – Cơ chế LIFO và ứng dụng", duration: "14:22", free: false },
        { title: "Valid Parentheses – Bài kinh điển Stack", duration: "18:00", free: false },
        { title: "Monotonic Stack – Kỹ thuật nâng cao", duration: "28:40", free: false },
      ],
    },
    {
      id: 6,
      title: "Tree (Binary Tree & BST)",
      lectures: 35,
      duration: "6 giờ 20 phút",
      lessons: [
        { title: "Binary Tree – Duyệt Pre/In/Post Order", duration: "20:15", free: false },
        { title: "Maximum Depth of Binary Tree", duration: "12:30", free: false },
        { title: "Level Order Traversal (BFS)", duration: "22:45", free: false },
        { title: "Lowest Common Ancestor", duration: "25:10", free: false },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      name: "Trần Văn Hải",
      avatar: "H",
      rating: 5,
      date: "1 tháng trước",
      comment:
        "Khóa học cực kỳ chất lượng! Thầy giảng rất rõ ràng, từng bước từng bước. Sau 2 tháng học tôi đã pass được vòng coding interview tại Shopee. Cực kỳ worth it!",
    },
    {
      id: 2,
      name: "Nguyễn Thị Lan Anh",
      avatar: "L",
      rating: 5,
      date: "3 tuần trước",
      comment:
        "Phần Dynamic Programming được giải thích quá xuất sắc. Đây là lần đầu tiên tôi thực sự hiểu DP sau khi học ở rất nhiều nguồn khác nhau. Highly recommended!",
    },
    {
      id: 3,
      name: "Phạm Đức Minh",
      avatar: "M",
      rating: 4,
      date: "2 tháng trước",
      comment:
        "Nội dung rất đầy đủ và phong phú. Chỉ mong thầy có thể cập nhật thêm các bài LeetCode 2024-2025 mới nhất. Phần cũ vẫn rất giá trị!",
    },
  ],
};

const RELATED_COURSES = [
  {
    id: 201,
    title: "Python từ cơ bản đến nâng cao – Complete Bootcamp",
    author: "AI Coding",
    image: "https://placehold.co/400x225/3b82f6/ffffff?text=Python+Bootcamp",
    rating: 4.8,
    reviews: "3.210",
    price: "299.000 ₫",
    originalPrice: "1.299.000 ₫",
    badges: ["Bán chạy nhất"],
    description: "Khóa học Python toàn diện từ A-Z, bao gồm OOP, modules, decorators và real-world projects.",
    objectives: ["Nắm vững Python từ cơ bản", "OOP trong Python", "Xây dựng dự án thực tế"],
    updatedDate: "04/2026",
    totalHours: 38,
    level: "Cơ bản đến Nâng cao",
  },
  {
    id: 202,
    title: "System Design cho Fresher & Junior Dev",
    author: "Minh Trí",
    image: "https://placehold.co/400x225/7c3aed/ffffff?text=System+Design",
    rating: 4.9,
    reviews: "1.045",
    price: "699.000 ₫",
    originalPrice: "2.499.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
    description: "Hiểu System Design từ cơ bản: Load Balancer, Database, Cache, CDN, Microservices.",
    objectives: ["Thiết kế hệ thống quy mô lớn", "Load balancing & caching", "Microservices architecture"],
    updatedDate: "05/2026",
    totalHours: 22,
    level: "Trung cấp",
  },
  {
    id: 203,
    title: "AWS Cloud Solutions Architect – Tiếng Việt",
    author: "Viet Tran",
    image: "https://placehold.co/400x225/f97316/ffffff?text=AWS+SAA",
    rating: 4.6,
    reviews: "892",
    price: "549.000 ₫",
    originalPrice: "1.999.000 ₫",
    badges: ["Cao cấp"],
    description: "Học AWS từ đầu, luyện thi chứng chỉ SAA-C03 với mock exam và hands-on lab thực tế.",
    objectives: ["Triển khai ứng dụng trên AWS", "Luyện thi SAA-C03", "VPC, EC2, S3, RDS, Lambda"],
    updatedDate: "03/2026",
    totalHours: 28,
    level: "Trung cấp đến Nâng cao",
  },
  {
    id: 204,
    title: "JavaScript & TypeScript nâng cao – Thiết kế Pattern",
    author: "Nam Nguyen Dev",
    image: "https://placehold.co/400x225/eab308/1c1d1f?text=JS+TS+Advanced",
    rating: 4.7,
    reviews: "1.560",
    price: "399.000 ₫",
    originalPrice: "1.499.000 ₫",
    badges: [],
    description: "Nắm vững JavaScript & TypeScript nâng cao: Closures, Promises, Design Patterns, SOLID.",
    objectives: ["JavaScript nâng cao", "TypeScript từ đầu", "Design patterns thực tế"],
    updatedDate: "02/2026",
    totalHours: 32,
    level: "Trung cấp",
  },
];

// ─── Sub Components ────────────────────────────────────────────────────────────

function RatingStars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[...Array(full)].map((_, i) => <Star key={i} size={size} fill="currentColor" />)}
      {half && <StarHalf size={size} fill="currentColor" />}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => <Star key={`e${i}`} size={size} className="text-amber-200" />)}
    </div>
  );
}

function AccordionSection({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          {open ? <ChevronUp size={18} className="text-gray-500 shrink-0" /> : <ChevronDown size={18} className="text-gray-500 shrink-0" />}
          <span className="font-bold text-[#1c1d1f] text-[15px] truncate">{section.title}</span>
        </div>
        <div className="text-xs text-gray-500 shrink-0 text-right">
          {section.lectures} bài • {section.duration}
        </div>
      </button>
      {open && (
        <div className="divide-y divide-gray-100">
          {section.lessons.map((lesson, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <Play size={14} className="text-gray-400 shrink-0" />
              <span className={`text-sm flex-1 ${lesson.free ? "text-purple-700 hover:underline cursor-pointer" : "text-gray-700"}`}>
                {lesson.title}
              </span>
              {lesson.free && (
                <span className="text-[11px] font-bold text-purple-600 border border-purple-300 rounded px-1.5 py-0.5 shrink-0">
                  Xem trước
                </span>
              )}
              <span className="text-xs text-gray-400 shrink-0">{lesson.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const CourseDetailPage = () => {
  const { id } = useParams();
  const course = COURSE; // In real app: fetch by id
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  return (
    <div className="bg-white text-[#1c1d1f] font-sans">
      {/* ─── Dark Hero Banner ─────────────────────────────────── */}
      <div className="bg-[#1c1d1f] w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left hero content */}
          <div className="text-white">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5 flex-wrap">
              <Link to="/home" className="hover:text-white !text-gray-400 !no-underline transition-colors">Trang chủ</Link>
              <span>/</span>
              <span className="hover:text-white cursor-pointer transition-colors">Phát triển</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cấu trúc dữ liệu</span>
              <span>/</span>
              <span className="text-white">Python & LeetCode</span>
            </nav>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black leading-tight mb-4 text-white">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base mb-5 leading-relaxed max-w-2xl">
              {course.subtitle}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {course.badges.map((badge, i) => (
                <span key={i} className="px-3 py-1 bg-[#eceb98] text-[#3d3c0a] text-xs font-black rounded">
                  {badge}
                </span>
              ))}
            </div>

            {/* Rating row */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <span className="font-black text-amber-400 text-lg">{course.rating}</span>
              <RatingStars rating={course.rating} size={16} />
              <span className="text-amber-400 text-sm underline cursor-pointer">
                ({course.ratingCount} đánh giá)
              </span>
              <span className="text-gray-400 text-sm">{course.studentsCount} học viên</span>
            </div>

            {/* Author */}
            <p className="text-sm text-gray-300 mb-3">
              Tạo bởi{" "}
              <span className="text-purple-400 underline cursor-pointer hover:text-purple-300 transition-colors">
                {course.author}
              </span>
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0" />
                Cập nhật {course.updatedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="shrink-0" />
                {course.language}
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart size={14} className="shrink-0" />
                {course.level}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="shrink-0" />
                {course.studentsCount} học viên
              </span>
            </div>
          </div>

          {/* Right column placeholder for sticky card alignment */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ─── Main Layout ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">

        {/* ── LEFT: Main Content ────────────────────────────────── */}
        <div className="min-w-0">

          {/* What you'll learn */}
          <section className="border border-gray-200 rounded-xl p-7 mb-10">
            <h2 className="text-2xl font-black mb-5 text-[#1c1d1f]">Bạn sẽ học được gì</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-[#1c1d1f] shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="text-sm text-gray-700 leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently bought together */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-6 text-[#1c1d1f]">Thường được mua cùng nhau</h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {RELATED_COURSES.map((rc) => (
                <CourseCard key={rc.id} course={rc}>
                  <CourseHoverDetail course={rc} />
                </CourseCard>
              ))}
            </div>
          </section>

          {/* Course Content / Accordion */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-2 text-[#1c1d1f]">Nội dung khóa học</h2>
            <p className="text-sm text-gray-500 mb-5">
              {course.sections.length} chương • {course.sections.reduce((acc, s) => acc + s.lectures, 0)} bài giảng • Tổng {course.totalHours} giờ
            </p>
            <div>
              {course.sections.map((section) => (
                <AccordionSection key={section.id} section={section} />
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4 text-[#1c1d1f]">Yêu cầu</h2>
            <ul className="space-y-2.5">
              {course.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d1f] shrink-0 mt-1.5" />
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-4 text-[#1c1d1f]">Mô tả</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">{course.description}</p>
          </section>

          {/* Instructor */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-6 text-[#1c1d1f]">Giảng viên</h2>
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
                {course.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-purple-700 hover:underline cursor-pointer mb-0.5">
                  {course.author}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{course.authorTitle}</p>
                <div className="flex flex-wrap gap-5 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400" fill="currentColor" /> 4.8 Xếp hạng giảng viên</span>
                  <span className="flex items-center gap-1.5"><Users size={14} /> 28.400 Học viên</span>
                  <span className="flex items-center gap-1.5"><Play size={14} /> 6 Khóa học</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Kỹ sư phần mềm cấp cao với hơn 8 năm kinh nghiệm, chuyên sâu về thuật toán và hệ thống phân tán. Từng làm việc tại Google và nhiều startup lớn. Đam mê giảng dạy và giúp các bạn trẻ Việt Nam chinh phục thị trường công nghệ thế giới.
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-2 text-[#1c1d1f]">Đánh giá của học viên</h2>

            {/* Rating Summary */}
            <div className="flex items-center gap-8 mb-7 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-center shrink-0">
                <div className="text-6xl font-black text-amber-500">{course.rating}</div>
                <RatingStars rating={course.rating} size={18} />
                <div className="text-sm text-gray-500 mt-1">Xếp hạng khóa học</div>
              </div>
              {/* Bar chart fake */}
              <div className="flex-1 space-y-2 min-w-0">
                {[
                  { stars: 5, pct: 72 },
                  { stars: 4, pct: 18 },
                  { stars: 3, pct: 6 },
                  { stars: 2, pct: 2 },
                  { stars: 1, pct: 2 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                      <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{row.pct}%</span>
                    <RatingStars rating={row.stars} size={12} />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-6">
              {course.reviews.map((rev) => (
                <div key={rev.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 text-white flex items-center justify-center font-bold shrink-0 text-base">
                    {rev.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-[#1c1d1f] text-sm">{rev.name}</span>
                      <RatingStars rating={rev.rating} size={13} />
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT: Sticky Checkout Sidebar ───────────────────── */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            {/* Video Preview */}
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-all">
                  <Play size={28} className="text-[#1c1d1f] ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Xem trước khóa học
                </span>
              </div>
            </div>

            <div className="p-5">
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-black text-[#1c1d1f]">{course.price}</span>
                <span className="text-base text-gray-400 line-through">{course.originalPrice}</span>
                <span className="text-sm font-bold text-red-500">-75%</span>
              </div>

              {/* Timer */}
              <p className="text-xs text-red-600 font-bold mb-4">
                🔥 Giảm giá còn <span className="font-black">1 ngày 12 giờ</span>!
              </p>

              {/* Buttons */}
              <button
                onClick={() => setAddedToCart(!addedToCart)}
                className={`w-full py-3.5 rounded-lg font-extrabold text-base mb-3 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-[#5624d0] hover:bg-[#4712c4] text-white"
                }`}
              >
                <ShoppingCart size={18} />
                {addedToCart ? "✓ Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
              </button>
              <button className="w-full py-3.5 border-2 border-[#1c1d1f] hover:bg-gray-50 text-[#1c1d1f] font-extrabold rounded-lg text-base mb-4 transition-all active:scale-95 cursor-pointer">
                Mua ngay
              </button>

              <p className="text-center text-xs text-gray-400 mb-5">
                Đảm bảo hoàn tiền 100% trong 30 ngày nếu bạn không hài lòng
              </p>

              {/* Includes */}
              <div>
                <h4 className="font-extrabold text-[#1c1d1f] text-sm mb-3">Khóa học này bao gồm:</h4>
                <ul className="space-y-2.5">
                  {[
                    { icon: Monitor, text: `${course.totalHours} giờ video theo yêu cầu` },
                    { icon: FileText, text: `${course.lectures} bài giảng` },
                    { icon: FileText, text: "25 bài tập thực hành có lời giải" },
                    { icon: Infinity, text: "Truy cập trọn đời không giới hạn" },
                    { icon: Globe, text: "Học trên điện thoại & máy tính" },
                    { icon: Trophy, text: "Giấy chứng nhận hoàn thành" },
                  ].map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <Icon size={15} className="text-gray-500 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all text-sm font-bold cursor-pointer ${
                  wishlist
                    ? "border-pink-400 text-pink-600 bg-pink-50"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart size={16} className={wishlist ? "fill-pink-500 text-pink-500" : ""} />
                {wishlist ? "Đã thêm vào danh sách" : "Thêm vào danh sách mong ước"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
