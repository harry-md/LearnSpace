import React from "react";
import {
  BookOpen,
  Users,
  Layers,
  Video,
  DollarSign,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const OverviewTab = ({
  courses,
  totalStudents,
  totalSections,
  totalLessonsAll,
  openManage,
}) => {
  return (
    <div style={{ padding: "32px" }}>
      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            icon: BookOpen,
            label: "Khóa học",
            value: courses.length,
            sub: `${courses.filter((c) => c.status === "published").length} đã xuất bản`,
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.08)",
            border: "#8b5cf6",
          },
          {
            icon: Layers,
            label: "Tổng chương",
            value: totalSections,
            sub: "Tất cả khóa học",
            color: "#10b981",
            bg: "rgba(16,185,129,0.08)",
            border: "#10b981",
          },
          {
            icon: Video,
            label: "Tổng bài học",
            value: totalLessonsAll,
            sub: "Video, Quiz, Tài liệu",
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
            border: "#f59e0b",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid #f3f4f6`,
              borderLeft: `4px solid ${border}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#1c1d1f",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#4b5563",
                  marginTop: "4px",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: "2px",
                }}
              >
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings highlight */}
      <div
        style={{
          background: "linear-gradient(135deg,#1c1d1f 0%,#3b1a7a 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <DollarSign size={18} color="#a78bfa" />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#a78bfa",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Tổng doanh thu tháng này
            </span>
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            1.254.640.000 ₫
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            <TrendingUp size={14} color="#34d399" />
            <span
              style={{
                fontSize: "13px",
                color: "#34d399",
                fontWeight: 600,
              }}
            >
              +12.4% so với tháng trước
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { label: "Học viên mới", value: "142", icon: Users },
            { label: "Đánh giá mới", value: "38", icon: Star },
            { label: "Hoàn thành", value: "94%", icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                <Icon size={20} color="#a78bfa" />
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "white",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: "2px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course performance */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f3f4f6",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <BarChart3 size={18} style={{ color: "#8b5cf6" }} />
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color: "#1c1d1f",
            }}
          >
            Hiệu suất khóa học
          </h2>
        </div>
        {courses.map((c, idx) => {
          const maxStudents = Math.max(
            ...courses.map((x) => x.studentsCount),
            1,
          );
          const pct = Math.round((c.studentsCount / maxStudents) * 100);
          return (
            <div
              key={c.id}
              style={{
                padding: "16px 24px",
                borderBottom:
                  idx < courses.length - 1 ? "1px solid #f9fafb" : "none",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              onClick={() => openManage(c)}
            >
              <img
                src={c.image}
                alt={c.title}
                style={{
                  width: "72px",
                  height: "42px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1c1d1f",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.title}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#8b5cf6",
                      }}
                    >
                      {c.studentsCount.toLocaleString()} học viên
                    </span>
                    {c.rating > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1c1d1f",
                          }}
                        >
                          {c.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      background: "#f3f4f6",
                      borderRadius: "99px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "99px",
                        background: "linear-gradient(90deg,#8b5cf6,#3b82f6)",
                        width: `${pct}%`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#9ca3af",
                }}
              >
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewTab;
