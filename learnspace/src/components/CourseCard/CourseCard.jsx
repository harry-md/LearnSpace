import { ShoppingCart, Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import CompareCard from "@/components/CompareCard/CompareCard";
import { useContext } from "react";
import { UIContext } from "@/configs/Context";
import CourseHoverDetail from "../CourseHoverDetail/CourseHoverDetail";

const CourseCard = ({ course }) => {
  const [uiState] = useContext(UIContext);
  const displayPrice =
    course.price != null
      ? course.price === 0
        ? "Miễn phí"
        : `${Number(course.price).toLocaleString("vi-VN")} VNĐ`
      : "";

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={`/course/${course.id}`}
          className="!no-underline min-w-[280px] w-[280px] h-full cursor-pointer snap-start flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
        >
          <div className="w-full h-[155px] overflow-hidden relative bg-slate-100 shrink-0">
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
            />
            {course.category && (
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-600/90 text-white">
                {course.category.name}
              </span>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1 gap-2">
            <div className="font-extrabold text-gray-900 text-[14px] leading-snug line-clamp-2 group-hover/card:text-purple-700 transition-colors">
              {course.name}
            </div>

            {course.teacher && (
              <div className="flex items-center gap-2">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-gray-200"
                />
                <span className="text-xs text-gray-500 truncate">
                  {course.teacher.fullName}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={11} />
                {(course.enrollmentCount ?? 0).toLocaleString()} học viên
              </span>
              <span className="flex items-center gap-1">
                <div className="flex items-center gap-1.5">
                  {course.avgRating != null ? (
                    <>
                      <span className="text-xs font-bold text-amber-600">
                        {Number(course.avgRating).toFixed(1)}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= Math.round(course.avgRating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200 fill-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">
                      Chưa có đánh giá
                    </span>
                  )}
                </div>
              </span>
            </div>

            <div className="mt-auto flex items-center justify-between pt-1">
              <span
                className={`font-black text-[17px] ${
                  course.price === 0 ? "text-emerald-600" : "text-orange-600"
                }`}
              >
                {displayPrice}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2 bg-purple-50 hover:bg-purple-100 text-[#5624d0] hover:text-[#4712c4] rounded-lg transition-colors border border-purple-100 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-auto p-0 border-0 shadow-none bg-transparent"
        side="right"
        align="start"
      >
        <CourseHoverDetail course={course} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default CourseCard;
