import {
  Star,
  Users,
  BookOpen,
  Tag,
  Calendar,
  ArrowLeftRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const CompareRow = ({ label, left, right, highlight }) => (
  <div
    className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-b border-gray-100 last:border-0 ${highlight ? "bg-purple-50/40 -mx-4 px-4 rounded-lg" : ""}`}
  >
    <div className="text-right">{left}</div>
    <div className="flex flex-col items-center gap-0.5 shrink-0 w-24">
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </span>
    </div>
    <div className="text-left">{right}</div>
  </div>
);

const StarRow = ({ rating }) => (
  <div className="flex items-center gap-1">
    {rating != null ? (
      <>
        <span className="text-xs font-bold text-amber-500">
          {Number(rating).toFixed(1)}
        </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={10}
              className={
                s <= Math.round(rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
        </div>
      </>
    ) : (
      <span className="text-[11px] text-gray-400 italic">Chưa có</span>
    )}
  </div>
);

const CompareCard = ({ course }) => {
  const [selectedCourse, setSelectedCourse] = useState({});

  useEffect(() => {
    setSelectedCourse(JSON.parse(localStorage.getItem("compareCourseTarget")));
  }, [course]);
  return (
    <div className="w-[620px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_1fr]">
        <div className="p-4 border-r border-gray-100">
          <div className="text-[9px] font-bold uppercase tracking-widest text-purple-500 mb-2">
            Khóa gốc
          </div>
          <div className="relative rounded-xl overflow-hidden h-28 bg-gray-100">
            <img
              src={
                selectedCourse?.image ||
                `https://placehold.co/400x225/3b82f6/ffffff?text=${selectedCourse?.name}`
              }
              alt="target course"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-2 leading-snug">
              {selectedCourse.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center w-8 shrink-0">
          <div className="w-px h-full bg-gray-100" />
        </div>

        <div className="p-4">
          <div className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-2">
            Đang xem
          </div>
          <div className="relative rounded-xl overflow-hidden h-28 bg-gray-100">
            <img
              src={
                course?.image ||
                `https://placehold.co/400x225/3b82f6/ffffff?text=${course?.name}`
              }
              alt="current course"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-2 leading-snug">
              {course.name}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col">
        <CompareRow
          label="Giáo viên"
          left={
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-gray-700 font-medium">
                {selectedCourse.teacher?.fullName}
              </span>
              <img
                src={
                  selectedCourse.teacher?.avatar ||
                  "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png"
                }
                alt="teacher"
                className="w-6 h-6 rounded-full object-cover border border-gray-200"
              />
            </div>
          }
          right={
            <div className="flex items-center gap-2">
              <img
                src={
                  course.teacher?.avatar ||
                  "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png"
                }
                alt="teacher"
                className="w-6 h-6 rounded-full object-cover border border-gray-200"
              />
              <span className="text-xs text-gray-700 font-medium">
                {course.teacher?.fullName}
              </span>
            </div>
          }
        />

        <CompareRow
          label="Danh mục"
          left={
            <span className="inline-flex items-center justify-end gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full ml-auto">
              <Tag size={9} />
              {selectedCourse.category?.name}
            </span>
          }
          right={
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              <Tag size={9} />
              {course.category?.name}
            </span>
          }
        />

        <CompareRow
          label="Giá"
          highlight
          left={
            selectedCourse.price === 0 ? (
              <span className="text-sm font-black text-emerald-600 block text-right">
                Miễn phí
              </span>
            ) : (
              <span className="text-sm font-black text-emerald-600 block text-right">
                {selectedCourse.price?.toLocaleString("vi-VN")} VNĐ
              </span>
            )
          }
          right={
            course.price === 0 ? (
              <span className="text-sm font-black text-emerald-600 block text-left">
                Miễn phí
              </span>
            ) : (
              <span className="text-sm font-black text-emerald-600 block text-left">
                {course.price?.toLocaleString("vi-VN")} VNĐ
              </span>
            )
          }
        />

        <CompareRow
          label="Đánh giá"
          left={
            <div className="flex justify-end">
              <StarRow rating={selectedCourse.avgRating} />
            </div>
          }
          right={<StarRow rating={course.avgRating} />}
        />

        <CompareRow
          label="Học viên"
          left={
            <div className="flex items-center justify-end gap-1 text-xs text-gray-600 font-medium">
              <Users size={11} className="text-gray-400" />
              {selectedCourse.enrollmentCount}
            </div>
          }
          right={
            <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
              <Users size={11} className="text-gray-400" />
              {course.enrollmentCount}
            </div>
          }
        />

        <CompareRow
          label="Số chương"
          left={
            <div className="flex items-center justify-end gap-1 text-xs text-gray-600 font-medium">
              <BookOpen size={11} className="text-gray-400" />
              {selectedCourse.chapterCount} chương
            </div>
          }
          right={
            <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
              <BookOpen size={11} className="text-gray-400" />
              {course.chapterCount} chương
            </div>
          }
        />
        <CompareRow
          label="Số bài học"
          left={
            <div className="flex items-center justify-end gap-1 text-xs text-gray-600 font-medium">
              <BookOpen size={11} className="text-gray-400" />
              {selectedCourse.lessonCount} bài học
            </div>
          }
          right={
            <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
              <BookOpen size={11} className="text-gray-400" />
              {course.lessonCount} bài học
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CompareCard;
