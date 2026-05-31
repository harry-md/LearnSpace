import React, { useContext, useEffect, useState } from "react";
import { BookOpen, PlayCircle, Trophy } from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { UserContext, UIContext } from "@/configs/Context";
import { useNavigate } from "react-router-dom";

const MyListsTab = () => {
  const [myCourses, setMyCourse] = useState([]);
  const [user] = useContext(UserContext);
  const [_, uiDispatch] = useContext(UIContext);
  const navigate = useNavigate();

  const loadMyCourse = async () => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await authApis(user.token).get(endpoints.enrolledCourses);
      const courses = res.data;

      console.log("courses", courses);
      setMyCourse(courses);
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message:
            err.response?.data?.message || "Không thể tải khóa học của tôi",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    loadMyCourse();
  }, []);

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <h3 className="text-lg font-bold text-[#1c1d1f] mb-6">
        Khóa học của tôi
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myCourses.map((course) => {
          const completed = course.completedCount || 0;
          const total = course.lessonCount || 0;
          const progressPercent =
            total > 0 ? Math.round((completed / total) * 100) : 0;
          return (
            <div
              key={course.id}
              className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    course.image
                      ? course.image
                      : `https://placehold.co/400x225/5624d0/ffffff?text=${encodeURIComponent(
                          course.name,
                        )}`
                  }
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-300"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <div className="bg-white/25 p-3 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <PlayCircle
                      className="w-10 h-10 text-white drop-shadow-lg"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="bg-[#5624d0] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    {course.category?.name || "Danh mục"}
                  </span>
                </div>
              </div>

              {/* Progress bar attached to image bottom */}
              <div className="h-1.5 w-full bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#5624d0] rounded-r-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h4 className="!font-bold !text-[15px] !text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-2">
                  {course.name}
                </h4>

                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={
                      course.teacher?.avatar ||
                      "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png"
                    }
                    alt="Teacher"
                    className="w-6 h-6 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600 font-bold line-clamp-1 m-0">
                      {course.teacher?.fullName || "Giảng viên"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 m-0 mt-0.5">
                      {course.teacher?.email || "Email"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-1.5 mb-2 -mt-1">
                  <BookOpen size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">
                    {course.chapterCount || 0} chương
                  </span>
                </div>

                <div className="space-y-3 pt-3 mt-auto border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-600 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          progressPercent > 0 ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>
                        {completed}/{total} bài học
                      </span>
                    </div>
                    <span
                      className={
                        progressPercent === 100
                          ? "text-green-600 font-bold"
                          : "text-[#5624d0] font-bold"
                      }
                    >
                      {progressPercent}%
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="w-full py-2.5 bg-[#f8f9fa] hover:bg-[#5624d0] hover:text-white text-[#1c1d1f] border border-[#d1d7dc] hover:border-[#5624d0] text-[13px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 group/btn"
                  >
                    {progressPercent === 100 ? (
                      <>
                        <Trophy
                          size={16}
                          className="text-yellow-500 group-hover/btn:text-yellow-400"
                        />
                        Ôn tập lại
                      </>
                    ) : progressPercent > 0 ? (
                      <>
                        <PlayCircle size={16} />
                        Tiếp tục học
                      </>
                    ) : (
                      <>
                        <PlayCircle size={16} />
                        Bắt đầu học
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyListsTab;
