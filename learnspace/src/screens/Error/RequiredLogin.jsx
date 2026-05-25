import React from "react";
import { Link } from "react-router-dom";
import { Lock, LogIn, UserPlus, ArrowLeft } from "lucide-react";

const RequiredLogin = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fa",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "48px 40px",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          textAlign: "center",
          maxWidth: "440px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Lock size={32} style={{ color: "#8b5cf6" }} />
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: 900,
            color: "#1c1d1f",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
          }}
        >
          Yêu cầu đăng nhập
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#6b7280",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Bạn cần đăng nhập hoặc tạo tài khoản để tiếp tục xem nội dung này.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 24px",
              background: "#5624d0",
              color: "white",
              fontWeight: 700,
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(86,36,208,0.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4712c4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#5624d0")}
          >
            <LogIn size={18} /> Đăng nhập
          </Link>

          <Link
            to="/register"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 24px",
              background: "white",
              color: "#1c1d1f",
              fontWeight: 700,
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8b5cf6";
              e.currentTarget.style.color = "#8b5cf6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#1c1d1f";
            }}
          >
            <UserPlus size={18} /> Tạo tài khoản mới
          </Link>
        </div>

        <Link
          to="/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#9ca3af",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#4b5563")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default RequiredLogin;
