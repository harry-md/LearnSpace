import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Users,
  Layers,
  ListVideo,
  DollarSign,
  CheckCircle,
  Clock,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import { totalLessons } from "../../../data/TeacherData";
const CoursesTab = ({
  courses,
  setModal,
  togglePublish,
  openManage,
  handleDeleteCourse,
}) => {
  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {courses.length === 0 && (
          <div
            style={{
              padding: "80px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              color: "#9ca3af",
            }}
          >
            <BookOpen size={48} style={{ opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: "15px" }}>
              Chưa có khóa học nào.
            </p>
            <button
              onClick={() => setModal("create-course")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: "#5624d0",
                color: "white",
                fontWeight: 700,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              <Plus size={15} /> Tạo khóa học đầu tiên
            </button>
          </div>
        )}
        {courses.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                {[
                  "Khóa học",
                  "Chương",
                  "Bài học",
                  "Doanh thu",
                  "Trạng thái",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  style={{
                    borderBottom: "1px solid #f9fafb",
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{
                          width: "80px",
                          height: "48px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "13px",
                            color: "#1c1d1f",
                            marginBottom: "3px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            maxWidth: "220px",
                          }}
                        >
                          {course.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                          {course.category} · {course.level}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Layers size={14} style={{ color: "#9ca3af" }} />
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1c1d1f",
                        }}
                      >
                        {course.sections.length}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <ListVideo size={14} style={{ color: "#9ca3af" }} />
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1c1d1f",
                        }}
                      >
                        {totalLessons(course.sections)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <DollarSign size={14} style={{ color: "#9ca3af" }} />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#10b981",
                        }}
                      >
                        {course.revenue}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button
                      onClick={() => togglePublish(course.id)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "99px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "none",
                        background:
                          course.status === "published"
                            ? "rgba(16,185,129,0.1)"
                            : "rgba(156,163,175,0.15)",
                        color:
                          course.status === "published" ? "#059669" : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {course.status === "published" ? (
                        <>
                          <CheckCircle size={12} />
                          Đã xuất bản
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          Bản nháp
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <button
                        onClick={() => openManage(course)}
                        title="Quản lý chương/bài"
                        style={{
                          padding: "7px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          background: "transparent",
                          color: "#8b5cf6",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(139,92,246,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Pencil size={15} />
                      </button>
                      <Link
                        to={`/course/${course.id}`}
                        title="Xem trang chi tiết"
                        style={{
                          padding: "7px",
                          borderRadius: "8px",
                          color: "#3b82f6",
                          display: "flex",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(59,130,246,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        title="Xóa khóa học"
                        style={{
                          padding: "7px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          background: "transparent",
                          color: "#ef4444",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
