import React, { useContext, useEffect, useState } from "react";
import { ShoppingCart, BookOpen } from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { useNavigate } from "react-router-dom";
import { UIContext } from "@/configs/Context";

const AllCoursesTab = () => {
  const [course, setCourse] = useState([]);
  const [, uiDispatch] = useContext(UIContext);
  const navigate = useNavigate();

  const loadAllCourse = async () => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await Apis.get(endpoints.courses);
      if (res.status === 200) {
        setCourse(res.data);
      }
    } catch (err) {
      uiDispatch({
        type: "SHOW_TOAST",
        message: "Lỗi hệ thống",
        type: "error",
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    loadAllCourse();
  }, []);

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <h3 className="text-lg font-bold text-[#1c1d1f] mb-6">Tất cả khóa học</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {course.map((item) => (
          <div className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={
                  item.image
                    ? item.image
                    : `https://placehold.co/400x225/f97316/ffffff?text=${item.name}`
                }
                alt="AWS"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1">
                {item.name}
              </h4>

              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-base text-[#1c1d1f]">
                    {item.price} VNĐ
                  </span>
                  <button
                    className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors cursor-pointer"
                    title="Thêm vào giỏ hàng"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    navigate(`/course/${item.id}`);
                  }}
                  className="w-full px-3 py-1.5 border border-[#5624d0] text-[#5624d0] hover:bg-purple-50 text-xs font-bold rounded transition-colors cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Course Card 2 */}
      </div>
    </div>
  );
};

export default AllCoursesTab;
