import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookMarked,
  Star,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  Settings,
  Globe,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import { UserContext } from "@/configs/Context";

const Sidebar = ({ view, setView }) => {
  const [user, dispatcher] = useContext(UserContext);
  const nav = useNavigate();
  const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "courses", label: "Khóa học của tôi", icon: BookOpen },
  ];

  return (
    <aside className="sidebar-aside">
      <div className="logo-container">
        <div className="flex items-center gap-[10px]">
          <div className="logo-icon-box">
            <BookMarked size={18} color="white" />
          </div>
          <div>
            <span className="logo-title">
              Teach<span className="text-[#a78bfa]">Space</span>
            </span>
          </div>
        </div>
      </div>

      <div className="teacher-card-container">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt=""
            className="teacher-avatar"
            style={{ objectFit: "cover" }}
          />
          <div className="min-w-0">
            <div className="teacher-name">{user.fullName}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              <span className="text-[11px] text-[#9ca3af]">
                {user.role === "TEACHER" ? "Giảng viên" : "Học viên"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Menu chính</div>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = view === id || (view === "manage" && id === "courses");
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`sidebar-btn ${active ? "active" : ""}`}
            >
              <Icon size={17} />
              <span className="text-[13px] font-semibold">{label}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto opacity-60" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-btn">
          <Globe size={17} />
          Về trang học viên
        </Link>
        <button
          className="sidebar-btn logout-btn"
          onClick={() => {
            dispatcher({ type: "LOGOUT", payload: null });
            nav("/login");
          }}
        >
          <LogOut size={17} />
          <span className="text-[13px] font-semibold">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
