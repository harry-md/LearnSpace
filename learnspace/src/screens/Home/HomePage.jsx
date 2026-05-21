import React from "react";
import { ChevronRight } from "lucide-react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseHoverDetail from "@/components/CourseHoverDetail/CourseHoverDetail";
import Header from "../../components/Header/Header";

const courses = [
  {
    id: 1,
    title: "Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày",
    author: "AI Coding",
    rating: 4.6,
    reviews: "1.070",
    price: "269.000 ₫",
    originalPrice: "1.059.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
    image: "https://placehold.co/400x225/1e3a8a/ffffff?text=Python",
    updatedDate: "tháng 5 năm 2026",
    totalHours: "23",
    level: "Tất cả các cấp độ",
    description:
      "Chinh Phục Python Trong 30 Ngày: Từ Cơ Bản Đến Nâng Cao (Tiếng Việt) - Lập trình Python",
    objectives: [
      "Nền tảng Python vững chắc để học tiếp AI, Data Science hay lập trình Web",
      "Kiến thức toàn diện về Python, bắt đầu với biến, kiểu dữ liệu, chuỗi, các phép toán",
      "Khám phá cách sử dụng cấu trúc điều khiển, vòng lặp, hàm, xử lý file",
    ],
  },
  {
    id: 2,
    title: "AWS Cloud for beginner (Vietnamese)",
    author: "Linh Nguyen",
    rating: 4.7,
    reviews: "1.253",
    price: "269.000 ₫",
    originalPrice: "1.829.000 ₫",
    badges: ["Cao cấp", "Bán chạy nhất"],
    image: "https://placehold.co/400x225/f97316/ffffff?text=AWS",
    updatedDate: "tháng 4 năm 2026",
    totalHours: "15.5",
    level: "Sơ cấp",
    description:
      "Học AWS từ cơ bản: EC2, S3, IAM, RDS. Thiết kế hệ thống Cloud bảo mật và tối ưu chi phí.",
    objectives: [
      "Hiểu rõ các dịch vụ cốt lõi của AWS (EC2, S3, RDS, VPC)",
      "Thực hành triển khai ứng dụng web thực tế lên AWS",
      "Chuẩn bị nền tảng kiến thức cho kỳ thi chứng chỉ AWS Cloud Practitioner",
    ],
  },
  {
    id: 3,
    title: "AWS Certified Solutions Architect - Associate (Tiếng Việt)",
    author: "Luu Ha Phuong",
    rating: 4.7,
    reviews: "299",
    price: "349.000 ₫",
    originalPrice: "1.919.000 ₫",
    badges: ["Bán chạy nhất"],
    image: "https://placehold.co/400x225/eab308/ffffff?text=AWS+Architect",
    updatedDate: "tháng 5 năm 2026",
    totalHours: "32",
    level: "Trung cấp",
    description:
      "Luyện thi AWS Certified Solutions Architect Associate SAA-C03 chi tiết với các bài lab thực tế.",
    objectives: [
      "Nắm vững kiến thức thiết kế hệ thống có tính sẵn sàng cao",
      "Giải quyết các bài toán kiến trúc thực tế trên đám mây AWS",
      "Hơn 500 câu hỏi ôn tập sát với đề thi thật",
    ],
  },
  {
    id: 4,
    title: "Từ vựng tiếng Anh thiết yếu",
    author: "Hải Trần Phi",
    rating: 4.6,
    reviews: "433",
    price: "289.000 ₫",
    originalPrice: "1.979.000 ₫",
    badges: ["Bán chạy nhất"],
    image: "https://placehold.co/400x225/4b5563/ffffff?text=English",
    updatedDate: "tháng 3 năm 2026",
    totalHours: "8",
    level: "Mọi cấp độ",
    description:
      "Nắm vững 3000 từ vựng tiếng Anh thông dụng nhất thông qua các tình huống giao tiếp thực tế.",
    objectives: [
      "Tự tin giao tiếp trong các tình huống hàng ngày",
      "Phương pháp ghi nhớ từ vựng lâu dài và hiệu quả",
      "Cải thiện kỹ năng phát âm và phản xạ nghe nói",
    ],
  },
  {
    id: 5,
    title: "PMP - Luyện thi chứng chỉ cấp tốc, 35pdu tiếng Việt",
    author: "Master Lee Education",
    rating: 4.8,
    reviews: "218",
    price: "1.599.000 ₫",
    originalPrice: "",
    badges: ["Cao cấp"],
    image: "https://placehold.co/400x225/334155/ffffff?text=PMP",
    updatedDate: "tháng 5 năm 2026",
    totalHours: "40",
    level: "Nâng cao",
    description:
      "Chương trình luyện thi chứng chỉ quản lý dự án PMP cấp tốc dựa trên PMBOK mới nhất.",
    objectives: [
      "Đủ điều kiện nhận 35 PDU để đăng ký thi PMP",
      "Hiểu sâu sắc 10 miền kiến thức và các quy trình quản lý dự án",
      "Chiến thuật làm bài thi và giải đề thi mẫu hiệu quả",
    ],
  },
];

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

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. TOP NAVIGATION */}
      <Header showCategories={true} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <SectionContainer>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
            U
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Chào mừng Udemy User!
            </h2>
            <a
              href="#"
              className="text-purple-600 font-semibold hover:text-purple-800 mt-2 text-base flex items-center gap-1 group"
            >
              Thêm nghề nghiệp và sở thích
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </SectionContainer>

        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Lĩnh vực sẽ học tiếp theo
            </h2>
            <div className="text-lg text-gray-700">Các khóa học thịnh hành</div>
          </div>

          <div className="relative group">
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course}>
                  <CourseHoverDetail course={course} />
                </CourseCard>
              ))}
            </div>

            <button className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        <SectionContainer className="flex-col">
          <h3 className="text-2xl font-extrabold mb-6 text-gray-900">
            Các khóa học hàng đầu về Phát triển
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"
              ></div>
            ))}
          </div>
        </SectionContainer>
      </main>

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

export default HomePage;
