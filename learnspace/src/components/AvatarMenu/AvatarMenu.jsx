import { UserContext } from "@/configs/Context";
import {
  User,
  BookOpen,
  ShoppingCart,
  History,
  LogOut,
  GraduationCap,
} from "lucide-react";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const AvatarMenu = ({ onClose }) => {
  const [user, userDispatcher] = useContext(UserContext);
  const nav = useNavigate();

  const handleLogout = () => {
    userDispatcher({ type: "LOGOUT", payload: null });
    nav("/");
    onClose?.();
  };

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
            {user ? user.fullName || user.username : "Học viên"}
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

      <div className="py-1.5 font-normal">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 py-2.5 px-4 text-[13px] !text-[#bc2222] hover:!bg-gray-50 hover:!text-purple-600 transition-colors !no-underline cursor-pointer"
        >
          <LogOut size={16} />
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default AvatarMenu;
