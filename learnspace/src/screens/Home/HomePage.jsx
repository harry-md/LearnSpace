import React, { useContext, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import CourseCard from "../../components/CourseCard/CourseCard";
import { UIContext, UserContext } from "@/configs/Context";
import { Link } from "react-router-dom";
import Apis, { endpoints } from "@/configs/Apis";

const HomePage = () => {
  const [user] = useContext(UserContext);
  const [, uiDispatch] = useContext(UIContext);
  const [courses, setCourses] = useState([]);

  const handleLoadCourses = async () => {
    try {
      uiDispatch({ type: "SHOW_LOADING" });
      const res = await Apis.get(`${endpoints.courses}?page=1`);
      setCourses(res.data);
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          dialog: {
            title: "Lỗi",
            message: "Có lỗi xảy ra khi tải danh sách khóa học",
            type: "error",
            onConfirm: () => uiDispatch({ type: "HIDE_DIALOG" }),
          },
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    handleLoadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <SectionContainer className="justify-between flex-wrap gap-y-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : user.firstName ? (
                user.firstName.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Chào mừng {user.firstName} {user.lastName}!
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Chúc bạn một ngày học tập hiệu quả! Tiếp tục chinh phục kiến
                thức mới hôm nay nhé.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right border-l border-gray-200 pl-6 hidden sm:flex shrink-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              {user.verified && (
                <span className="text-[9px] font-extrabold text-white bg-blue-500 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                  Đã xác minh
                </span>
              )}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 ${
                  user.role === "STUDENT"
                    ? "text-purple-600 bg-purple-50 border-purple-100"
                    : user.role === "TEACHER"
                      ? "text-blue-600 bg-blue-50 border-blue-100"
                      : "text-amber-600 bg-amber-50 border-amber-100"
                }`}
              >
                {user.role === "STUDENT"
                  ? "Học viên"
                  : user.role === "TEACHER"
                    ? "Giảng viên"
                    : "Quản trị"}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-750 mb-0.5">
              {user.email}
            </div>
            {user.createdAt && (
              <div className="text-[11px] text-gray-400 font-semibold">
                Thành viên từ:{" "}
                {(() => {
                  const date = new Date(user.createdAt);
                  return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
                })()}
              </div>
            )}
          </div>
        </SectionContainer>

        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Tất cả khóa học
            </h2>
          </div>

          <div className="relative group">
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <button className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        <SectionContainer className="flex-col">
          <h3 className="text-2xl font-extrabold mb-6 text-gray-900">
            Các khóa học hàng đầu về Phát triển
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
            <div className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
            <div className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
            <div className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
            <div className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
            <div className="h-[280px] w-56 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"></div>
          </div>
        </SectionContainer>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
};

export default HomePage;
