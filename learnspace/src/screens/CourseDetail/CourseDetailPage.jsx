import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Play,
  Monitor,
  FileText,
  Infinity as InfinityIcon,
  Trophy,
  Globe,
  Star,
  StarHalf,
  Clock,
  Heart,
  ShoppingCart,
  GraduationCap,
} from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { CartContext, UIContext, UserContext } from "@/configs/Context";
import ProtectLessonDisplay from "./ProtectLessonDisplay/ProtectLessonDisplay";
import useLessonProcess from "@/hooks/useLessonProcess";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [user] = useContext(UserContext);
  const { lessonProgress, getLessonProgress } = useLessonProcess();

  const [courseDetails, setCourseDetails] = useState({ chapters: [] });
  const [notFound, setNotFound] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [, uiDispatch] = useContext(UIContext);
  const [cart, cartDispatch] = useContext(CartContext);
  const [review, setReview] = useState([]);

  const nav = useNavigate();

  const addToCart = (course) => {
    cartDispatch({ type: "ADD_COURSE", payload: course });
  };

  const enrollFreeCourse = async () => {
    try {
      uiDispatch({ type: "SHOW_LOADING" });
      const res = await authApis(user.token).post(
        endpoints.enrollFreeCourse(id),
      );
      if (res.data && res.data.id) {
        uiDispatch({
          type: "SHOW_DIALOG",
          payload: {
            title: "Thành công",
            message: "Đã đăng ký khóa học thành công",
            type: "success",
          },
        });
      }
    } catch (err) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: err.response?.data?.message || "Lỗi khi đăng ký khóa học",
          type: "error",
        },
      });
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  const loadReview = async () => {
    try {
      const res = await Apis.get(endpoints.reviewCourse(id));
      setReview(res.data.results);
    } catch (err) {
      console.log("Có lỗi xảy ra!");
    }
  };

  const loadCourseDetails = async () => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await Apis.get(`${endpoints.courses}/${id}`);
      if (res.data && res.data.id) {
        const course = res.data;
        setCourseDetails(course);

        if (user && user.token) {
          try {
            const enrollRes = await authApis(user.token).get(
              endpoints.enrolledCourses,
            );
            const enrolledList = enrollRes.data;
            const enrolled = enrolledList.some((c) => c.id == id);
            setIsEnrolled(enrolled);
          } catch (enrollErr) {
            console.error("Lỗi khi check enroll!");
            setIsEnrolled(false);
          }
        } else {
          setIsEnrolled(false);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message:
            error.response?.data?.message || "Lỗi khi tải chi tiết khóa học",
          type: "error",
        },
      });
      setNotFound(true);
    } finally {
      uiDispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    loadCourseDetails();
    loadReview();
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-6 text-center animate-[fadeIn_0.4s_ease-out]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-sm">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Không tìm thấy khóa học
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm
          tra lại đường dẫn.
        </p>
        <Link
          to="/learning"
          className="px-5 py-2.5 bg-[#5624d0] hover:bg-[#4712c4] text-white text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95 no-underline hover:text-white"
        >
          Quay lại khóa học của tôi
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#1c1d1f] font-sans animate-[fadeIn_0.4s_ease-out]">
      <div className="bg-[#1c1d1f] w-full">
        <div
          className={`max-w-7xl mx-auto px-6 md:px-12 py-6 grid grid-cols-1 gap-8 ${!isEnrolled ? "lg:grid-cols-[1fr_360px]" : ""}`}
        >
          <div className="text-white">
            <Link
              to="/learning"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3 transition-colors no-underline !text-gray-400 font-semibold"
            >
              <ArrowLeft size={16} />
              Quản lý khóa học của tôi
            </Link>

            <h1 className="text-2xl md:text-3xl font-black leading-tight mb-2 text-white">
              {courseDetails.name}
            </h1>

            <p className="text-gray-300 text-base mb-3 leading-relaxed max-w-2xl">
              {courseDetails.description}
            </p>

            <div className="flex items-center flex-wrap gap-3 mb-2">
              <span className="font-black text-amber-400 text-lg">
                {courseDetails?.avgRating?.toFixed(1) || "0.0"}
              </span>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({
                  length: Math.floor(courseDetails?.avgRating || 0),
                }).map((_, i) => (
                  <Star key={`full-${i}`} size={16} fill="currentColor" />
                ))}
                {(courseDetails?.avgRating || 0) % 1 >= 0.5 && (
                  <StarHalf size={16} fill="currentColor" />
                )}
                {Array.from({
                  length:
                    5 -
                    Math.floor(courseDetails?.avgRating || 0) -
                    ((courseDetails?.avgRating || 0) % 1 >= 0.5 ? 1 : 0),
                }).map((_, i) => (
                  <Star
                    key={`empty-${i}`}
                    size={16}
                    className="text-gray-300"
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-2">
              Tạo bởi{" "}
              <span className="text-purple-400 underline cursor-pointer hover:text-purple-300 transition-colors">
                {courseDetails.teacher?.fullName}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0" />
                {courseDetails.updatedAt}
              </span>
            </div>
          </div>

          {!isEnrolled && <div className="hidden lg:block" />}
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 gap-10 items-start ${!isEnrolled ? "lg:grid-cols-[1fr_360px]" : ""}`}
      >
        <div className="min-w-0">
          {courseDetails.introVideo && (
            <section className="mb-10">
              <h2 className="text-2xl font-black mb-4 text-[#1c1d1f]">
                Video giới thiệu khóa học
              </h2>

              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-black border border-gray-200">
                <video
                  src={courseDetails.introVideo}
                  controls
                  className="w-full h-full object-cover"
                  poster={courseDetails.image}
                />
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="text-2xl font-black mb-2 text-[#1c1d1f]">
              Nội dung khóa học
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {courseDetails.chapters?.length || 0} chương •{" "}
              {courseDetails.chapters?.reduce(
                (acc, ch) => acc + (ch.lessons?.length || 0),
                0,
              ) || 0}{" "}
              bài giảng
            </p>
            <div>
              {(courseDetails.chapters || []).map((chapter) => (
                <details
                  key={chapter.id}
                  className="border border-gray-200 rounded-lg overflow-hidden mb-2"
                  open
                >
                  <summary className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left gap-3 cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <ChevronDown
                        className="text-gray-500 shrink-0 chevron-icon"
                        size={18}
                      />
                      <span className="font-bold text-[#1c1d1f] text-[15px] truncate">
                        {chapter.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 text-right">
                      {chapter.lessons?.length || 0} bài giảng
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 text-left ml-5 whitespace-pre-wrap">
                      {chapter.description}
                    </div>
                  </summary>
                  <div className="divide-y divide-gray-100 border-t border-gray-200">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (isEnrolled) {
                              setSelectedLessonId(lesson.id);
                              setShowLessonModal(true);
                            } else {
                              uiDispatch({
                                type: "SHOW_DIALOG",
                                payload: {
                                  show: true,
                                  title: "Thông báo",
                                  message:
                                    "Bạn cần phải đăng ký khoá học để xem nội dung chi tiết của khoá học",
                                  type: "warning",
                                },
                              });
                            }
                          }}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors cursor-pointer group/lesson"
                        >
                          <Play
                            size={14}
                            className="text-gray-400 group-hover/lesson:text-purple-600 transition-colors shrink-0"
                          />
                          <span className="text-sm flex-1 text-gray-700 group-hover/lesson:text-purple-600 group-hover/lesson:underline transition-colors font-medium">
                            {lesson.title}
                          </span>
                          {lesson.videoLength !== undefined &&
                          lesson.videoLength !== null ? (
                            <span className="text-xs text-gray-400 shrink-0 font-medium">
                              {Math.floor(lesson.videoLength / 60)}:
                              {String(lesson.videoLength % 60).padStart(2, "0")}
                            </span>
                          ) : null}

                          {lesson.progress?.completed ? (
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                              Hoàn thành
                            </span>
                          ) : lesson.progress ? (
                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                              Hoàn thành{" "}
                              {Math.round(
                                (lesson.progress.watchedSec /
                                  lesson.videoLength) *
                                  100,
                              )}
                              %
                            </span>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-gray-500 italic">
                        Chưa có bài học nào trong chương này
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black mb-2 text-[#1c1d1f]">
              Đánh giá của học viên
            </h2>

            {/* Rating Summary */}
            <div className="flex items-center justify-center gap-8 mb-7 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-center shrink-0">
                <div className="text-6xl font-black text-amber-500">
                  {courseDetails?.avgRating?.toFixed(1) || "0.0"}
                </div>
                <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-2">
                  {Array.from({
                    length: Math.floor(courseDetails?.avgRating || 0),
                  }).map((_, i) => (
                    <Star key={`full-${i}`} size={18} fill="currentColor" />
                  ))}
                  {(courseDetails?.avgRating || 0) % 1 >= 0.5 && (
                    <StarHalf size={18} fill="currentColor" />
                  )}
                  {Array.from({
                    length:
                      5 -
                      Math.floor(courseDetails?.avgRating || 0) -
                      ((courseDetails?.avgRating || 0) % 1 >= 0.5 ? 1 : 0),
                  }).map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      size={18}
                      className="text-gray-300"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Xếp hạng khóa học
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {review.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 text-white flex items-center justify-center font-bold shrink-0 text-base">
                    {item.student.avatar ? (
                      <img
                        src={item.student.avatar}
                        alt={item.student.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      item.student.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-[#1c1d1f] text-sm">
                        {item.student.fullName}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                        {Array.from({ length: 5 - item.rating }).map((_, i) => (
                          <Star
                            key={`empty-${i}`}
                            size={13}
                            className="text-gray-300"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {!isEnrolled && (
          <div className="lg:sticky lg:top-20 self-start">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="w-full aspect-video overflow-hidden">
                <img
                  src={
                    courseDetails.image ||
                    "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1774930142/10033487_w4ifgq.jpg"
                  }
                  alt={courseDetails.name || "Chi tiết khóa học"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl font-black text-[#1c1d1f]">
                    {courseDetails.price
                      ? `${Number(courseDetails.price).toLocaleString("vi-VN")} ₫`
                      : "Miễn phí"}
                  </span>
                </div>

                {courseDetails.price !== 0 ? (
                  <>
                    <button
                      onClick={() => addToCart(courseDetails)}
                      className="w-full py-2.5 rounded-lg font-extrabold text-sm mb-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-[#5624d0] hover:bg-[#4712c4] text-white"
                    >
                      <ShoppingCart size={16} />
                      Thêm vào giỏ hàng
                    </button>

                    <p className="text-center text-[11px] text-gray-500 mb-1">
                      Đảm bảo hoàn tiền 100% trong 30 ngày
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        enrollFreeCourse();
                        nav("/learning");
                      }}
                      className="w-full py-2.5 rounded-lg font-extrabold text-sm mb-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-[#11ac4f] hover:bg-[#0a6d32] text-white"
                    >
                      <GraduationCap size={16} />
                      Bắt đầu học
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ProtectLessonDisplay
        isShow={showLessonModal}
        lessonId={selectedLessonId}
        onClose={() => {
          setShowLessonModal(false);
          loadCourseDetails();
        }}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        summary::-webkit-details-marker { display: none; }
        summary { list-style: none; }
        details summary .chevron-icon {
          transition: transform 0.2s ease;
        }
        details[open] summary .chevron-icon {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
