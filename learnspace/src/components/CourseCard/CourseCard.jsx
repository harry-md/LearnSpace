import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import Apis, { endpoints } from "@/configs/Apis";
import CourseHoverDetail from "@/components/CourseHoverDetail/CourseHoverDetail";

const CourseCard = ({ course, children }) => {
  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayPrice =
    course.price != null
      ? course.price === 0
        ? "Miễn phí"
        : `${Number(course.price).toLocaleString("vi-VN")} VNĐ`
      : "";

  const handleOpenChange = async (open) => {
    if (children) return;
    if (open && !hoverData && !loading) {
      setLoading(true);
      try {
        const res = await Apis.get(`${endpoints.courses}/${course.id}`);
        setHoverData(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết khóa học:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <HoverCard className="flex h-full" onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <div className="min-w-[280px] w-[280px] h-full cursor-pointer snap-start flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card">
          <div className="w-full h-[155px] overflow-hidden relative bg-slate-100">
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
            />
            {course.active && (
              <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-white/95 px-2.5 py-0.5 rounded-full shadow-sm border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Đang mở đăng ký
              </span>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1">
            <div className="font-extrabold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-3 group-hover/card:text-purple-700 transition-colors">
              {course.name}
            </div>

            <div className="mt-auto flex items-center justify-between">
              <span className="font-black text-[17px] text-orange-600">
                {displayPrice}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 bg-purple-50 hover:bg-purple-100 text-[#5624d0] hover:text-[#4712c4] rounded-lg transition-colors border border-purple-100 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="center"
        className="w-[360px] p-4 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
      >
        {children ? (
          children
        ) : loading ? (
          <div className="flex flex-col gap-3 py-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2 mt-4">
              <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
          </div>
        ) : hoverData ? (
          <CourseHoverDetail course={hoverData} />
        ) : (
          <div className="text-xs text-gray-400 text-center py-2">
            Không thể tải thông tin chi tiết
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default CourseCard;
