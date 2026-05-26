import { useState, useEffect, useRef, useContext } from "react";
import { X, Lock, FileText, Clock, BookOpen, ShieldCheck } from "lucide-react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";

const ProtectLessonDisplay = ({ isShow, lessonId, onClose }) => {
  const [user] = useContext(UserContext);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);

  const videoRef = useRef(null);

  // Load lesson details
  useEffect(() => {
    if (!isShow || !lessonId) return;

    const fetchLesson = async () => {
      setLoading(true);
      setError("");
      setLesson(null);
      setIsBlurred(false);
      try {
        let res;
        if (user && user.token) {
          res = await authApis(user.token).get(
            `${endpoints.lessons}/${lessonId}`,
          );
        } else {
          res = await Apis.get(`${endpoints.lessons}/${lessonId}`);
        }
        setLesson(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài học:", err);
        setError(
          "Không thể tải thông tin bài học hoặc bạn không có quyền truy cập.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [isShow, lessonId, user]);

  // Window Focus Blur protection
  useEffect(() => {
    if (!isShow) return;

    const handleBlur = () => {
      setIsBlurred(true);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isShow]);

  // Prevent keyboard shortcuts
  useEffect(() => {
    if (!isShow) return;

    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
      }
      if (
        (e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "u")) ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShow]);

  if (!isShow) return null;

  const handleResumePlay = () => {
    setIsBlurred(false);
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((err) => console.log("Play interrupted:", err));
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút${secs > 0 ? ` ${secs} giây` : ""}`;
  };

  const resolveVideoUrl = (videoField) => {
    if (!videoField) return "";
    if (videoField.startsWith("http://") || videoField.startsWith("https://")) {
      return videoField;
    }
    return `http://localhost:8080/LearnSpaceBackend/uploads/${videoField}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8 animate-[fadeIn_0.2s_ease-out]"
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (videoRef.current) videoRef.current.pause();
          onClose?.();
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col relative max-h-[92vh] animate-[slideUp_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-[#1c1d1f] truncate max-w-md lg:max-w-lg">
                {lesson ? lesson.title : "Đang tải bài học..."}
              </h3>
              {lesson?.order && (
                <p className="text-[11px] text-gray-500 font-medium">
                  Bài {lesson.order}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (videoRef.current) videoRef.current.pause();
              onClose?.();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1c1d1f] hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading state */}
          {loading && (
            <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5624d0]"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="aspect-video w-full flex flex-col items-center justify-center bg-gray-50 text-center p-6">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Lock size={24} className="text-red-500" />
              </div>
              <p className="text-sm font-bold text-[#1c1d1f] mb-1">
                Không thể truy cập
              </p>
              <p className="text-xs text-gray-500 max-w-xs mb-5">{error}</p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#5624d0] hover:bg-[#4712c4] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Lesson content */}
          {lesson && !loading && !error && (
            <>
              {/* Video container */}
              <div className="relative bg-[#1c1d1f]">
                <video
                  ref={videoRef}
                  src={resolveVideoUrl(lesson.video)}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  className={`w-full aspect-video object-contain transition-all duration-300 ${
                    isBlurred
                      ? "blur-xl brightness-50 select-none pointer-events-none"
                      : ""
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Blurred overlay */}
                {isBlurred && (
                  <div
                    onClick={handleResumePlay}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 cursor-pointer z-10 animate-[fadeIn_0.15s_ease-out]"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20">
                      <Lock className="text-white" size={28} />
                    </div>
                    <p className="text-sm font-bold text-white max-w-xs leading-relaxed">
                      Video đã tạm dừng để bảo vệ bản quyền
                    </p>
                    <p className="text-xs text-white/60 mt-2">
                      Nhấp chuột để tiếp tục xem
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson info bar */}
              <div className="px-5 py-4 border-t border-gray-200">
                <div className="flex flex-wrap items-start gap-6">
                  {/* Left: Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={15} className="text-[#5624d0] shrink-0" />
                      <span className="text-xs font-extrabold text-[#1c1d1f] uppercase tracking-wide">
                        Nội dung bài học
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {lesson.content || "Bài học này chưa có mô tả chi tiết."}
                    </p>
                  </div>

                  {/* Right: Metadata chips */}
                  <div className="shrink-0 flex flex-col gap-2">
                    {lesson.videoLength != null && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
                        <Clock size={14} className="text-[#5624d0]" />
                        <span className="font-semibold">
                          {formatDuration(lesson.videoLength)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="font-semibold">Bản quyền bảo vệ</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProtectLessonDisplay;
