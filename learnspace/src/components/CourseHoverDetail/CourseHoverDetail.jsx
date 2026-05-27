import { Calendar, BookOpen, Heart, ArrowRight } from "lucide-react";

const CourseHoverDetail = ({ course }) => {
  const formattedPrice = course.price
    ? `${Number(course.price).toLocaleString("vi-VN")} ₫`
    : "Miễn phí";

  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div className="text-gray-900 text-left p-1">
      <div className="flex items-center justify-between mb-3">
        {course.category?.name && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded">
            {course.category.name}
          </span>
        )}
        {course.active && (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đang hoạt động
          </span>
        )}
      </div>

      <h4 className="font-extrabold text-gray-900 text-lg leading-snug mb-2.5">
        {course.name || course.title}
      </h4>

      <p className="text-sm text-gray-600 leading-relaxed mb-4 font-normal">
        {course.description}
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={
              course.teacher?.avatar ||
              "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png"
            }
            alt={course.teacher?.fullName}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-semibold mb-0.5">
              Giảng viên chính
            </p>
            <p className="text-sm font-bold text-gray-800 truncate leading-none">
              {course.teacher?.fullName || course.author || "Chưa cập nhật"}
            </p>
            <p className="text-xs text-gray-500 truncate mt-1">
              {course.teacher?.email}
            </p>
          </div>
        </div>

        <div className="pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-gray-400" />
            <span>Tạo ngày: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-gray-400" />
            <span>Học trực tuyến</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Học phí
          </span>
          <span className="text-xl font-black text-purple-600">
            {formattedPrice}
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="py-2.5 px-4 bg-[#5624d0] hover:bg-[#4712c4] text-white font-extrabold rounded-lg transition-all text-sm text-center cursor-pointer flex items-center gap-1 shadow-md active:scale-95">
            Xem chi tiết
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseHoverDetail;
