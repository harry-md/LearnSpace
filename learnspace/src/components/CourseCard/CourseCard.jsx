import { Star, StarHalf } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const CourseCard = ({ course, children }) => {
  return (
    <HoverCard className="flex h-full">
      <HoverCardTrigger asChild>
        <div className="min-w-[280px] w-[280px] h-full cursor-pointer snap-start flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-full h-[155px] overflow-hidden relative">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-3 flex flex-col flex-1">
            <div className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors">
              {course.title}
            </div>

            <span className="text-xs text-gray-500 mb-3 font-medium cursor-pointer hover:underline hover:text-purple-600 w-fit">
              {course.author}
            </span>

            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-bold text-orange-700 text-sm">
                {course.rating}
              </span>
              <div className="flex text-orange-400">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <StarHalf size={14} fill="currentColor" />
              </div>
              <span className="text-xs text-gray-400 font-medium">
                ({course.reviews})
              </span>
            </div>

            <div className="mt-auto">
              <div className="flex items-end gap-2 mb-3">
                <span className="font-extrabold text-lg text-gray-900">
                  {course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-400 line-through mb-0.5">
                    {course.originalPrice}
                  </span>
                )}
              </div>

              {course.badges && course.badges.length > 0 && (
                <div className="flex gap-2">
                  {course.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#eceb98] text-[#3d3c0a] text-xs font-bold rounded-md tracking-tight"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="center" className="w-[360px] p-4">
        {children}
      </HoverCardContent>
    </HoverCard>
  );
};

export default CourseCard;
