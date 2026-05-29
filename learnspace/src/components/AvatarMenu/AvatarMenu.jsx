import { UIContext, UserContext } from "@/configs/Context";
import {
  User,
  BookOpen,
  ShoppingCart,
  History,
  LogOut,
  GraduationCap,
  GitCompare,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModalCourseCompareSelect from "../Header/ModalCourseCompareSelect/ModalCourseCompareSelect";

const AvatarMenu = ({ onClose }) => {
  const [user, userDispatcher] = useContext(UserContext);
  const [uiState, uiDispatch] = useContext(UIContext);
  const nav = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [compareCourseTarget, setCompareCourseTarget] = useState(null);

  const compareMode = uiState.compareMode;

  const handleLogout = () => {
    userDispatcher({ type: "LOGOUT", payload: null });
    nav("/");
    onClose?.();
  };

  useEffect(() => {
    const course = localStorage.getItem("compareCourseTarget");
    const savedMode = localStorage.getItem("compareMode") === "true";
    if (savedMode && course) {
      uiDispatch({ type: "COMPARE_COURSE_MODE", payload: true });
    }
    if (course) {
      setCompareCourseTarget(JSON.parse(course));
    }
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-3 px-4 py-3 text-gray-900">
        {user && user.avatar ? (
          <img
            src={user.avatar}
            className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
            alt="Avatar"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm shrink-0">
            <User size={20} className="text-white" />
          </div>
        )}
        <div className="overflow-hidden">
          <h4 className="font-extrabold text-sm text-[#2d2f31]">
            {user
              ? `${user.lastName || ""} ${user.firstName || ""}`.trim() ||
                user.username
              : "Guest"}
          </h4>
          <p
            className="text-xs text-gray-500 truncate"
            title={user ? user.email : ""}
          >
            {user ? user.email : ""}
          </p>
        </div>
      </div>

      <hr className="border-gray-150 m-0" />
      {user.role.includes("TEACHER") && (
        <div className="py-1.5 font-normal">
          <Link
            to="/teacher"
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline cursor-pointer"
          >
            <GraduationCap size={16} />
            Trang giáo viên
          </Link>
        </div>
      )}

      <div className="py-1.5 font-normal">
        <Link
          to="/learning"
          onClick={onClose}
          className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline cursor-pointer"
        >
          <BookOpen size={16} />
          Học tập
        </Link>
        <hr className="border-gray-150 m-0" />
        <Link
          to={"/cart"}
          onClick={onClose}
          className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline cursor-pointer"
        >
          <ShoppingCart size={16} />
          Giỏ hàng của tôi
        </Link>
      </div>

      <hr className="border-gray-150 m-0" />

      <div className="py-1.5 font-normal">
        <Link
          to="#"
          onClick={onClose}
          className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
        >
          <History size={16} />
          Lịch sử mua
        </Link>
      </div>

      <hr className="border-gray-150 m-0" />

      <div className="py-1.5 font-normal">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center cursor-pointer gap-3 py-2.5 px-4 text-[13px] !text-[#2d2f31] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline"
        >
          <User size={16} />
          Hồ sơ công khai
        </Link>
      </div>

      <hr className="border-gray-150 m-0" />

      <div className="py-2.5 px-4 text-[13px] text-[#2d2f31] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare size={16} className="text-[#2d2f31]" />
            <span className="font-semibold">Chế độ so sánh</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => {
                if (
                  e.target.checked &&
                  !localStorage.getItem("compareCourseTarget")
                ) {
                  uiDispatch({
                    type: "SHOW_DIALOG",
                    payload: {
                      title: "Chưa chọn khóa học",
                      message:
                        "Bạn cần chọn khóa học cần so sánh trước khi bật tính năng này.",
                      type: "warning",
                    },
                  });
                  return;
                }
                uiDispatch({ type: "COMPARE_COURSE_MODE", payload: e.target.checked });
                localStorage.setItem("compareMode", e.target.checked);
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between mt-1 text-[11px] gap-2">
          <span className="text-gray-500 truncate max-w-[150px]">
            {compareCourseTarget
              ? compareCourseTarget.name
              : "Chưa chọn khóa gốc"}
          </span>
          <button
            onClick={() => setOpenModal(true)}
            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 transition-colors cursor-pointer text-[10px]"
          >
            Chọn khóa học
          </button>
        </div>
      </div>

      <hr className="border-gray-150 m-0" />

      <div className="py-1.5 font-normal">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#bc2222] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline cursor-pointer"
        >
          <LogOut size={16} />
          Đăng xuất
        </div>
      </div>
      <ModalCourseCompareSelect
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default AvatarMenu;
