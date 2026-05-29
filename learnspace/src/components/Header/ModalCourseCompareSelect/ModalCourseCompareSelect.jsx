import React, { useContext, useEffect, useState } from "react";
import { X, Search, CheckCircle2 } from "lucide-react";
import Apis, { endpoints } from "@/configs/Apis";
import { UIContext } from "@/configs/Context";

const ModalCourseCompareSelect = ({ openModal, setOpenModal }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courses, setCourses] = useState([]);
  const [, uiDispatch] = useContext(UIContext);

  const handleSaveCompareCourse = async (course) => {
    localStorage.setItem("compareCourseTarget", JSON.stringify(course));
    setOpenModal(false);
    uiDispatch({
      type: "SHOW_DIALOG",
      payload: {
        title: "Thành công",
        message: "Đã lưu khóa học để so sánh",
        type: "success",
      },
    });
  };

  const loadSearchResults = async (keyword) => {
    try {
      const res = await Apis.get(`${endpoints.courses}?kw=${keyword}`);
      setCourses(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setCourses([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      loadSearchResults(searchKeyword);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  return (
    <div>
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Chọn khóa học để so sánh
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Tìm và chọn khóa học bạn muốn so sánh
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group cursor-pointer"
                >
                  <div className="w-24 h-14 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 shrink-0 overflow-hidden border border-gray-200">
                    <img
                      src={
                        course.image ||
                        `https://placehold.co/96x56/7c3aed/ffffff?text=Course+${course.name}`
                      }
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
                      {course.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <img
                        src={
                          course.teacher.avatar ||
                          `https://placehold.co/96x56/7c3aed/ffffff?text=Course+${course.teacher.fullName}`
                        }
                        alt="Course thumbnail"
                        className="w-4 h-4 rounded-full bg-gray-200 inline-block"
                      />
                      {course.teacher.fullName}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveCompareCourse(course)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all shadow-sm shadow-purple-200 cursor-pointer"
                  >
                    <CheckCircle2 size={13} />
                    Chọn
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCourseCompareSelect;
