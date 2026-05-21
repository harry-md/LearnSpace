import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../../components/Header/Header";
import { Chip } from "@heroui/react";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseHoverDetail from "../../components/CourseHoverDetail/CourseHoverDetail";

const recommendedCourses = [
  {
    id: 1,
    title: "AWS Architecting: The Ultimate Course (Tiếng Việt)",
    author: "Viet Tran",
    image: "https://placehold.co/400x225/1e3a8a/ffffff?text=AWS+Architecting",
    rating: 4.9,
    reviews: "43",
    price: "2.499.000 ₫",
    originalPrice: null,
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
  {
    id: 2,
    title: "Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày",
    author: "AI Coding",
    image: "https://placehold.co/400x225/3b82f6/ffffff?text=Python+Programming",
    rating: 4.6,
    reviews: "1.070",
    price: "269.000 ₫",
    originalPrice: "1.059.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
  {
    id: 3,
    title: "AWS Cloud for beginner (Vietnamese)",
    author: "Linh Nguyen",
    image: "https://placehold.co/400x225/f97316/ffffff?text=AWS+Cloud",
    rating: 4.7,
    reviews: "1.253",
    price: "269.000 ₫",
    originalPrice: "1.829.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
  {
    id: 4,
    title: "Business Analysis (ITBA) Thực Chiến: Cơ bản + Kỹ năng mềm",
    author: "Lê Thị Bích Thuận",
    image: "https://placehold.co/400x225/10b981/ffffff?text=Business+Analysis",
    rating: 4.8,
    reviews: "843",
    price: "2.499.000 ₫",
    originalPrice: null,
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
  {
    id: 5,
    title: "AWS Certified Solutions Architect - Associate (Tiếng Việt)",
    author: "Luu Ho Phuong",
    image:
      "https://placehold.co/400x225/eab308/ffffff?text=AWS+Solutions+Associate",
    rating: 4.7,
    reviews: "299",
    price: "349.000 ₫",
    originalPrice: "1.919.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
  {
    id: 6,
    title: "React & Next.js Masterclass: Xây Dựng Dự Án Thực Tế",
    author: "Hau Nguyen",
    image: "https://placehold.co/400x225/6366f1/ffffff?text=React+NextJS",
    rating: 4.9,
    reviews: "512",
    price: "499.000 ₫",
    originalPrice: "2.199.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
  },
];

const popularTopics = [
  "AI tạo sinh",
  "Chứng chỉ CNTT",
  "Khoa học dữ liệu",
  "ChatGPT",
  "Kỹ thuật tạo lệnh",
];


const CartPage = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* 1. HEADER (SHARED NAVBAR) */}
      <Header />

      {/* 2. MAIN BODY */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-10 w-full">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-[#1c1d1f] tracking-tight mb-8">
          Giỏ hàng
        </h1>

        {/* Empty State Banner */}
        <div className="border border-gray-200 rounded-lg p-10 text-center mb-12 bg-gray-50/50 shadow-sm">
          <p className="text-[#2d2f31] text-base md:text-lg font-medium">
            Giỏ hàng của bạn trống – hãy thay đổi điều đó. Đã đến lúc học thêm
            kỹ năng mới!
          </p>
        </div>

        {/* Recommended Section (Students Are Viewing) */}
        <section className="mb-14 relative group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1c1d1f]">
              Học viên đang xem
            </h2>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all shadow-sm cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all shadow-sm cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards slider */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course}>
                <CourseHoverDetail course={course} />
              </CourseCard>
            ))}
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#1c1d1f] mb-6">
            Chủ đề phổ biến
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularTopics.map((topic, idx) => (
              <Chip
                key={idx}
                className="px-5 py-3 border border-gray-300 font-bold text-[#1c1d1f] hover:bg-gray-50 hover:border-gray-400 active:scale-98 transition-all rounded-full text-sm cursor-pointer shadow-sm bg-white"
              >
                {topic}
              </Chip>
            ))}
          </div>
        </section>
      </main>

      {/* 3. PROMO BANNER / FOOTER */}
      <footer className="mt-auto bg-[#1c1d1f] text-white py-12 px-6 md:px-12 border-t border-gray-800 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8 mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              Giảng dạy online cho cả thế giới
            </h3>
            <p className="text-sm text-gray-400">
              Tạo một khóa học video online, tiếp cận học viên trên toàn cầu và
              kiếm tiền
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

      {/* Hide scrollbar styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
};

export default CartPage;
