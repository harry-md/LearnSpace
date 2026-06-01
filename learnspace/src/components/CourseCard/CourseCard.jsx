import { ShoppingCart, Star, Users, BookOpen } from "lucide-react";

import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { useContext } from "react";
import { CartContext, UIContext } from "@/configs/Context";
import CourseHoverDetail from "../CourseHoverDetail/CourseHoverDetail";

const CourseCard = ({ course, className }) => {
  const [uiState] = useContext(UIContext);
  const [cart, cartDispatch] = useContext(CartContext);

  const handleAddToCart = (course) => {
    cartDispatch({ type: "ADD_COURSE", payload: course });
  };
  const displayPrice =
    course.price != null
      ? course.price === 0
        ? "Miễn phí"
        : `${Number(course.price).toLocaleString("vi-VN")} VNĐ`
      : "";

  const cardClass = className || "min-w-[280px] w-[280px] snap-start";

  const cardContent = (
    <Link
      to={`/course/${course.id}`}
      className={`!no-underline h-full cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card ${cardClass}`}
    >
      <div className="w-full aspect-video overflow-hidden relative bg-slate-100 shrink-0">
        <img
          src={
            course.image ||
            `https://placehold.co/400x225/7c3aed/ffffff?text=${course.name}`
          }
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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Users size={11} />
            {(course.enrollmentCount ?? 0).toLocaleString()} học viên
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
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
                <span className="text-[11px] text-gray-400 italic whitespace-nowrap">
                  Chưa có đánh giá
                </span>
              )}
            </div>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span
            className={`font-black text-[15px] whitespace-nowrap ${
              course.price === 0 ? "text-emerald-600" : "text-orange-600"
            }`}
          >
            {displayPrice}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(course);
            }}
            className="p-2 bg-purple-50 hover:bg-purple-100 text-[#5624d0] hover:text-[#4712c4] rounded-lg transition-colors border border-purple-100 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{cardContent}</HoverCardTrigger>
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
