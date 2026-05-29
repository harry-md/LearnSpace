import {
  Star,
  Users,
  BookOpen,
  Layers,
  ArrowRight,
  GitCompare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useContext, useEffect } from "react";
import { UIContext } from "@/configs/Context";

const SingleCourseDetail = ({
  course,
  uiState,
  uiDispatch,
  nav,
  badgeText,
  badgeColor,
}) => {
  const formattedPrice =
    course?.price != null
      ? course.price === 0
        ? "Miễn phí"
        : `${Number(course.price).toLocaleString("vi-VN")} VNĐ`
      : "—";

  const handleCompareClick = () => {
    if (uiState.compareMode) {
      localStorage.removeItem("compareCourseTarget");
      localStorage.removeItem("compareMode");
      uiDispatch({ type: "COMPARE_COURSE_MODE", payload: false });
    } else {
      localStorage.setItem("compareCourseTarget", JSON.stringify(course));
      localStorage.setItem("compareMode", "true");
      uiDispatch({ type: "COMPARE_COURSE_MODE", payload: true });
    }
  };

  if (!course) return null;

  return (
    <div
      className={`w-80 bg-white rounded-2xl shadow-xl border overflow-hidden text-left ${badgeText ? "border-" + badgeColor.split("-")[1] + "-200" : "border-gray-100"}`}
    >
      {badgeText && (
        <div
          className={`py-1.5 text-center text-[10px] font-extrabold uppercase tracking-widest text-white ${badgeColor}`}
        >
          {badgeText}
        </div>
      )}
      <div className="relative h-36 bg-gray-100 overflow-hidden shrink-0">
        <img
          src={
            course.image ||
            "https://placehold.co/300x144/f1f5f9/94a3b8?text=Course"
          }
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {course.category?.name && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide text-white bg-purple-600/90 px-2 py-0.5 rounded-full shadow-sm">
            {course.category.name}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h4 className="font-extrabold text-gray-900 text-[14px] leading-snug line-clamp-2">
          {course.name}
        </h4>

        <div className="flex items-center gap-2">
          <img
            src={
              course.teacher?.avatar ||
              "https://placehold.co/36/e2e8f0/94a3b8?text=?"
            }
            alt={course.teacher?.fullName}
            className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-800 truncate leading-none">
              {course.teacher?.fullName || "—"}
            </div>
            <div className="text-[10px] text-gray-400 truncate leading-none mt-0.5">
              {course.teacher?.email}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-gray-50 rounded-lg py-1 px-1">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <Users size={11} />
            </div>
            <div className="text-sm font-black text-gray-800">
              {(course.enrollmentCount ?? 0).toLocaleString()}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">
              Học viên
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg py-1 px-1">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <Layers size={11} />
            </div>
            <div className="text-sm font-black text-gray-800">
              {course.chapterCount ?? 0}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">
              Chương
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg py-1 px-1">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <BookOpen size={11} />
            </div>
            <div className="text-sm font-black text-gray-800">
              {course.lessonCount ?? 0}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">
              Bài học
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {course.avgRating != null ? (
            <>
              <span className="text-xs font-black text-amber-500">
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
              <span className="text-[10px] text-gray-400 ml-0.5">đánh giá</span>
            </>
          ) : (
            <span className="text-[11px] text-gray-400 italic">
              Chưa có đánh giá
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Học phí
            </span>
            <span
              className={`text-lg font-black leading-none ${
                course.price === 0 ? "text-emerald-500" : "text-orange-500"
              }`}
            >
              {formattedPrice}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCompareClick}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-1 text-[11px] font-bold rounded-xl transition-all active:scale-95 cursor-pointer border whitespace-nowrap ${
                uiState.compareMode
                  ? "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-transparent hover:border-red-200"
                  : "bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-600 border-transparent hover:border-purple-200"
              }`}
            >
              <GitCompare size={12} className="shrink-0" />
              {uiState.compareMode ? "Ngừng so sánh" : "So sánh"}
            </button>
            <button
              onClick={() => {
                nav(`/course/${course.id}`);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95 shadow-sm shadow-purple-200 cursor-pointer"
            >
              Xem chi tiết
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseHoverDetail = ({ course }) => {
  const nav = useNavigate();
  const [uiState, uiDispatch] = useContext(UIContext);

  const compareTargetStr = localStorage.getItem("compareCourseTarget");
  const compareTarget = compareTargetStr ? JSON.parse(compareTargetStr) : null;

  useEffect(() => {
    const savedMode = localStorage.getItem("compareMode") === "true";
    if (savedMode && compareTargetStr) {
      uiDispatch({ type: "COMPARE_COURSE_MODE", payload: true });
    }
  }, []);

  const isSameCourse = compareTarget && course.id === compareTarget.id;

  if (uiState.compareMode && compareTarget && !isSameCourse) {
    return (
      <div className="flex gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-[20px] shadow-sm">
        <SingleCourseDetail
          course={compareTarget}
          uiState={uiState}
          uiDispatch={uiDispatch}
          nav={nav}
          badgeText="Khóa gốc"
          badgeColor="bg-purple-600"
        />
        <SingleCourseDetail
          course={course}
          uiState={uiState}
          uiDispatch={uiDispatch}
          nav={nav}
          badgeText="Đang xem"
          badgeColor="bg-blue-500"
        />
      </div>
    );
  }

  return (
    <SingleCourseDetail
      course={course}
      uiState={uiState}
      uiDispatch={uiDispatch}
      nav={nav}
    />
  );
};

export default CourseHoverDetail;
