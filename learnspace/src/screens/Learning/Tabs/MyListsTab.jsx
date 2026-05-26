import React, { useContext, useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";
import { useNavigate } from "react-router-dom";

const MyListsTab = () => {
  const [myCourses, setMyCourse] = useState([]);
  const [user] = useContext(UserContext);
  const navigate = useNavigate();

  const loadMyCourse = async () => {
    try {
      const res = await authApis(user.token).get(endpoints.enrolled_courses);
      const courses = res.data;

      const coursesWithProgress = await Promise.all(
        courses.map(async (c) => {
          try {
            const progress = await authApis(user.token).get(
              endpoints.course_progress(c.courseId),
            );

            const courseDetailRes = await Apis.get(
              `${endpoints.courses}/${c.courseId}`,
            );
            const courseInfo = courseDetailRes.data;

            return { ...c, courseInfo, progress: progress.data };
          } catch (e) {
            console.error(
              "Lỗi khi tải thông tin/progress cho khóa học:",
              c.courseId,
              e,
            );
            return { ...c, courseInfo: null, progress: null };
          }
        }),
      );

      setMyCourse(coursesWithProgress);
    } catch (err) {
      console.error("Lỗi khi tải khóa học của tôi:", err);
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
          return (
            <div
              key={course.courseId}
              className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    course.courseInfo.image
                      ? course.courseInfo.image
                      : `https://placehold.co/400x225/1e3a8a/ffffff?text=${course.courseName}`
                  }
                  alt="Python"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div
                    className="h-full bg-[#5624d0]"
                    style={{ width: `${course.progress.percent}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1">
                  {course.courseName}
                </h4>
                <p className="text-xs text-gray-500 font-medium mb-3">
                  {course.courseInfo.teacherName}
                </p>
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-[10.5px] text-gray-500 font-semibold">
                    <span>{`${course.progress.completedCount}/${course.progress.totalCount} bài`}</span>
                    <span>{`${course.progress.percent}% hoàn thành`}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${course.courseId}`)}
                    className="w-full px-3 py-2 bg-[#5624d0] hover:bg-purple-800 text-white text-xs font-bold rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle size={13} />
                    Tiếp tục học
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
