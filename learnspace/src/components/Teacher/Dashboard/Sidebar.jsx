import React from "react";
import { Link } from "react-router-dom";
import {
  BookMarked,
  Star,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Zap,
  Settings,
  Globe,
} from "lucide-react";

const Sidebar = ({ view, setView }) => {
  const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "courses", label: "Khóa học của tôi", icon: BookOpen },
  ];

  return (
    <aside
      style={{
        width: "260px",
        background: "#1c1d1f",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BookMarked size={18} color="white" />
          </div>
          <div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              Teach<span style={{ color: "#a78bfa" }}>Space</span>
            </span>
            <div
              style={{
                fontSize: "10px",
                color: "#6b7280",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Instructor
            </div>
          </div>
        </div>
      </div>

      {/* Teacher card */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
            }}
          >
            NT
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "13px",
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Nguyễn Minh Trí
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "2px",
              }}
            >
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                4.8 · Giảng viên
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#4b5563",
            textTransform: "uppercase",
            padding: "8px 8px 4px",
          }}
        >
          Menu chính
        </div>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = view === id || (view === "manage" && id === "courses");
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                marginBottom: "2px",
                background: active ? "rgba(139,92,246,0.2)" : "transparent",
                color: active ? "#a78bfa" : "#9ca3af",
              }}
              onMouseEnter={(e) =>
                !active &&
                ((e.currentTarget.style.background = "rgba(255,255,255,0.06)"),
                (e.currentTarget.style.color = "white"))
              }
              onMouseLeave={(e) =>
                !active &&
                ((e.currentTarget.style.background = "transparent"),
                (e.currentTarget.style.color = "#9ca3af"))
              }
            >
              <Icon size={17} />
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{label}</span>
              {active && (
                <ChevronRight
                  size={14}
                  style={{ marginLeft: "auto", opacity: 0.6 }}
                />
              )}
            </button>
          );
        })}

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#4b5563",
            textTransform: "uppercase",
            padding: "16px 8px 4px",
          }}
        >
          Công cụ
        </div>
        {[
          { label: "Thống kê doanh thu", icon: BarChart3 },
          { label: "Đánh giá học viên", icon: Star },
          { label: "Thông báo", icon: Zap },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginBottom: "2px",
              background: "transparent",
              color: "#9ca3af",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)"),
              (e.currentTarget.style.color = "white")
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.background = "transparent"),
              (e.currentTarget.style.color = "#9ca3af")
            )}
          >
            <Icon size={17} />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#9ca3af",
            transition: "all 0.15s",
            marginBottom: "2px",
          }}
          onMouseEnter={(e) => (
            (e.currentTarget.style.background = "rgba(255,255,255,0.06)"),
            (e.currentTarget.style.color = "white")
          )}
          onMouseLeave={(e) => (
            (e.currentTarget.style.background = "transparent"),
            (e.currentTarget.style.color = "#9ca3af")
          )}
        >
          <Settings size={17} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>
            Cài đặt tài khoản
          </span>
        </button>
        <Link
          to="/home"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 10px",
            borderRadius: "8px",
            color: "#9ca3af",
            textDecoration: "none",
            transition: "all 0.15s",
            fontSize: "13px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (
            (e.currentTarget.style.background = "rgba(255,255,255,0.06)"),
            (e.currentTarget.style.color = "white")
          )}
          onMouseLeave={(e) => (
            (e.currentTarget.style.background = "transparent"),
            (e.currentTarget.style.color = "#9ca3af")
          )}
        >
          <Globe size={17} />
          Về trang học viên
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
