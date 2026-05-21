import { Check, Heart, ShieldCheck } from "lucide-react";

const CourseHoverDetail = ({ course }) => {
  return (
    <div className="text-gray-900 text-left">
      <h4 className="font-extrabold text-gray-900 text-lg leading-snug mb-2">
        {course.title}
      </h4>

      <div className="flex flex-wrap gap-2 mb-2.5">
        {course.badges?.includes("Cao cấp") && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#5022c3] text-white text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck size={11} className="fill-white/20" />
            Cao cấp
          </span>
        )}
        {course.badges?.map((badge, idx) => {
          if (badge === "Cao cấp") return null;
          const isBestSeller = badge === "Bán chạy nhất";
          return (
            <span
              key={idx}
              className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider ${
                isBestSeller
                  ? "bg-[#ccfbf1] text-[#0f766e]"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {badge}
            </span>
          );
        })}
      </div>

      <p className="text-xs text-emerald-800 font-semibold mb-1.5">
        Đã cập nhật <span className="font-bold">{course.updatedDate}</span>
      </p>

      <p className="text-xs text-gray-500 mb-3">
        Tổng số {course.totalHours} giờ • {course.level}
      </p>

      <p className="text-sm text-gray-700 leading-relaxed mb-4 font-normal">
        {course.description}
      </p>

      <ul className="space-y-2 mb-5">
        {course.objectives?.map((obj, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-sm text-gray-700 font-normal leading-normal"
          >
            <Check size={16} className="text-gray-500 shrink-0 mt-0.5" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <button className="flex-grow py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg transition-colors text-base text-center cursor-pointer">
          Thêm vào giỏ hàng
        </button>
        <button className="p-3 border border-purple-600 hover:bg-purple-50 text-purple-600 rounded-full transition-colors flex items-center justify-center cursor-pointer">
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default CourseHoverDetail;
