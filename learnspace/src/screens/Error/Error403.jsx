import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Error403 = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fa",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px", padding: "32px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <ShieldAlert size={40} style={{ color: "#ef4444" }} />
        </div>

        <h1
          style={{
            fontSize: "80px",
            fontWeight: 900,
            color: "#1c1d1f",
            lineHeight: 1,
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          403
        </h1>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#1c1d1f",
            marginBottom: "12px",
          }}
        >
          Không có quyền truy cập
        </h2>

        <p
          style={{
            fontSize: "15px",
            color: "#6b7280",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Bạn không có đủ quyền hạn để xem nội dung của trang này. Vui lòng đăng
          nhập với tài khoản có cấp bậc phù hợp hoặc liên hệ quản trị viên.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#5624d0",
            color: "white",
            fontWeight: 700,
            borderRadius: "10px",
            textDecoration: "none",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(86,36,208,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#4712c4")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#5624d0")}
        >
          <ArrowLeft size={18} />
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Error403;
