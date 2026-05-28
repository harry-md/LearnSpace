import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { UIContext, UserContext } from "@/configs/Context";
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

  const loadCourseDetails = async () => {
    uiDispatch({ type: "SHOW_LOADING" });
    try {
      const res = await Apis.get(`${endpoints.courses}/${id}`);
      if (res.data && res.data.id) {
        const course = res.data;

        setCourseDetails(course);

        // 4. Check enrollment status
        if (user && user.token) {
          try {
            const enrollRes = await authApis(user.token).get(
              endpoints.enrolled_courses,
            );
            const enrolledList = enrollRes.data;
            const enrolled = enrolledList.some((c) => c.id == id);
            setIsEnrolled(enrolled);
          } catch (enrollErr) {
            console.error("Lỗi khi check enroll:", enrollErr);
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
      {/* ─── Dark Hero Banner ─────────────────────────────────── */}
      <div className="bg-[#1c1d1f] w-full">
        <div
          className={`max-w-7xl mx-auto px-6 md:px-12 py-6 grid grid-cols-1 gap-8 ${!isEnrolled ? "lg:grid-cols-[1fr_360px]" : ""}`}
        >
          {/* Left hero content */}
          <div className="text-white">
            {/* Back to Management button */}
            <Link
              to="/learning"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3 transition-colors no-underline !text-gray-400 font-semibold"
            >
              <ArrowLeft size={16} />
              Quản lý khóa học của tôi
            </Link>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black leading-tight mb-2 text-white">
              {courseDetails.name}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base mb-3 leading-relaxed max-w-2xl">
              {courseDetails.description}
            </p>

            {/* Rating row */}
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <span className="font-black text-amber-400 text-lg">4.7</span>
              <div className="flex items-center gap-0.5 text-amber-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <StarHalf size={16} fill="currentColor" />
              </div>
              <span className="text-amber-400 text-sm underline cursor-pointer">
                (2.134 đánh giá)
              </span>
            </div>

            {/* Author */}
            <p className="text-sm text-gray-300 mb-2">
              Tạo bởi{" "}
              <span className="text-purple-400 underline cursor-pointer hover:text-purple-300 transition-colors">
                {courseDetails.teacher?.fullName}
              </span>
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="shrink-0" />
                {courseDetails.updatedAt}
              </span>
            </div>
          </div>

          {/* Right column placeholder for sticky card alignment */}
          {!isEnrolled && <div className="hidden lg:block" />}
        </div>
      </div>

      {/* ─── Main Layout ──────────────────────────────────────────── */}
      <div
        className={`max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 gap-10 items-start ${!isEnrolled ? "lg:grid-cols-[1fr_360px]" : ""}`}
      >
        {/* ── LEFT: Main Content ────────────────────────────────── */}
        <div className="min-w-0">
          {/* Intro Video Section */}
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

          {/* Course Content / Accordion */}
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

          {/* Related Courses Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-6 text-[#1c1d1f]">
              Các khóa học khác
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {/* Related Course Card 1 */}
              <div className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group min-w-[280px] max-w-[300px] shrink-0 snap-start">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src="https://placehold.co/400x225/3b82f6/ffffff?text=NextJS+Course"
                    alt="NextJS"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1">
                    Lập trình Web nâng cao với NextJS
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    Nguyễn Văn A
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-black text-amber-500 text-xs">
                        4.8
                      </span>
                      <div className="flex text-amber-400 gap-0.5">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                      </div>
                      <span className="text-gray-400 text-[10px]">(1.420)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base text-[#1c1d1f]">
                        699.000 ₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Course Card 2 */}
              <div className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group min-w-[280px] max-w-[300px] shrink-0 snap-start">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src="https://placehold.co/400x225/7c3aed/ffffff?text=React+Native"
                    alt="React Native"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1">
                    Lập trình di động Multi-platform với React Native
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    Nguyễn Văn A
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-black text-amber-500 text-xs">
                        4.9
                      </span>
                      <div className="flex text-amber-400 gap-0.5">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                      </div>
                      <span className="text-gray-400 text-[10px]">(890)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base text-[#1c1d1f]">
                        799.000 ₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Course Card 3 */}
              <div className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group min-w-[280px] max-w-[300px] shrink-0 snap-start">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src="https://placehold.co/400x225/f97316/ffffff?text=HTML+CSS+JS"
                    alt="HTML CSS JS"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1">
                    HTML, CSS và JavaScript cho người mới bắt đầu
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    AI Coding
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-black text-amber-500 text-xs">
                        4.6
                      </span>
                      <div className="flex text-amber-400 gap-0.5">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <StarHalf size={12} fill="currentColor" />
                      </div>
                      <span className="text-gray-400 text-[10px]">(3.210)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base text-[#1c1d1f]">
                        199.000 ₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="mb-10">
            <h2 className="text-2xl font-black mb-2 text-[#1c1d1f]">
              Đánh giá của học viên
            </h2>

            {/* Rating Summary */}
            <div className="flex items-center gap-8 mb-7 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-center shrink-0">
                <div className="text-6xl font-black text-amber-500">4.7</div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <StarHalf size={18} fill="currentColor" />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Xếp hạng khóa học
                </div>
              </div>
              {/* Bar chart fake */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-2 bg-amber-400 rounded-full"
                      style={{ width: "72%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">72%</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-2 bg-amber-400 rounded-full"
                      style={{ width: "18%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">18%</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} className="text-amber-200" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-2 bg-amber-400 rounded-full"
                      style={{ width: "6%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">6%</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-2 bg-amber-400 rounded-full"
                      style={{ width: "2%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">2%</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-2 bg-amber-400 rounded-full"
                      style={{ width: "2%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">2%</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                    <Star size={12} className="text-amber-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-6">
              {/* Review 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 text-white flex items-center justify-center font-bold shrink-0 text-base">
                  H
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-bold text-[#1c1d1f] text-sm">
                      Trần Văn Hải
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-400">1 tháng trước</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Khóa học cực kỳ chất lượng! Giảng viên giảng rất rõ ràng,
                    từng bước từng bước. Sau 2 tháng học tôi đã tự tin ứng dụng
                    vào dự án thực tế. Cực kỳ worth it!
                  </p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 text-white flex items-center justify-center font-bold shrink-0 text-base">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-bold text-[#1c1d1f] text-sm">
                      Nguyễn Thị Lan Anh
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-400">3 tuần trước</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Nội dung ReactJS được giải thích quá xuất sắc. Đây là lần
                    đầu tiên tôi thực sự hiểu các Hook cơ bản sau khi tự học ở
                    rất nhiều nguồn khác nhau. Highly recommended!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT: Sticky Checkout Sidebar ───────────────────── */}
        {!isEnrolled && (
          <div className="lg:sticky lg:top-20 self-start">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              {/* Course Image */}
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
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-2xl font-black text-[#1c1d1f]">
                    {courseDetails.price
                      ? `${Number(courseDetails.price).toLocaleString("vi-VN")} ₫`
                      : "Miễn phí"}
                  </span>
                </div>

                {/* Buttons */}
                <button className="w-full py-2.5 rounded-lg font-extrabold text-sm mb-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-[#5624d0] hover:bg-[#4712c4] text-white">
                  <ShoppingCart size={16} />
                  Thêm vào giỏ hàng
                </button>
                <button className="w-full py-2.5 border-2 border-[#1c1d1f] hover:bg-gray-50 text-[#1c1d1f] font-extrabold rounded-lg text-sm mb-3 transition-all active:scale-95 cursor-pointer">
                  Mua ngay
                </button>

                <p className="text-center text-[11px] text-gray-500 mb-1">
                  Đảm bảo hoàn tiền 100% trong 30 ngày
                </p>
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
