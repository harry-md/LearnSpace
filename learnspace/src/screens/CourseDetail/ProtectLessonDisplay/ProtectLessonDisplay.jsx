import { useEffect, useRef } from "react";
import {
  X,
  Lock,
  FileText,
  Clock,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  VideoOff,
} from "lucide-react";
import useLessonProcess from "@/hooks/useLessonProcess";

const ProtectLessonDisplay = ({ isShow, lesson, lessonId, onClose }) => {
  const { lessonProgress, getLessonProgress, updateLessonProgress } =
    useLessonProcess();

  const videoRef = useRef(null);
  const lastTriggeredTime = useRef(0);
  const hasSeeked = useRef(false);

  const handleTimeUpdate = (e) => {
    const currentTime = Math.floor(e.target.currentTime);
    if (
      currentTime > 0 &&
      currentTime % 10 === 0 &&
      currentTime !== lastTriggeredTime.current
    ) {
      lastTriggeredTime.current = currentTime;
      updateLessonProgress(lessonId, currentTime);
    }
  };

  const handleSeeked = async (e) => {
    const currentTime = e.target.currentTime;
    await updateLessonProgress(lessonId, currentTime);
  };

  const handlePause = async () => {
    const currentTime = videoRef.current.currentTime;
    await updateLessonProgress(lessonId, currentTime);
  };

  const handleLoadedMetadata = (e) => {
    if (lessonProgress && lessonProgress.watchedSec && !hasSeeked.current) {
      e.target.currentTime = lessonProgress.watchedSec;
      hasSeeked.current = true;
    }
  };

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

  useEffect(() => {
    if (isShow && lessonId) getLessonProgress(lessonId);
  }, [isShow, lessonId]);

  useEffect(() => {
    hasSeeked.current = false;
  }, [lessonId, isShow]);

  useEffect(() => {
    if (
      videoRef.current &&
      lessonProgress &&
      lessonProgress.watchedSec &&
      !hasSeeked.current
    ) {
      videoRef.current.currentTime = lessonProgress.watchedSec;
      hasSeeked.current = true;
    }
  }, [lessonProgress, lesson]);

  if (!isShow) return null;

  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút${secs > 0 ? ` ${secs} giây` : ""}`;
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
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#5624d0] flex items-center justify-center shrink-0">
              <BookOpen size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-[#1c1d1f] truncate max-w-md lg:max-w-lg">
                {lesson ? lesson.title : "Đang tải bài học..."}
              </h3>
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

        <div className="flex-1 overflow-y-auto">
          {lesson && (
            <>
              <div className="relative bg-[#1c1d1f]">
                {lesson.video ? (
                  <video
                    ref={videoRef}
                    src={lesson.video}
                    onPause={handlePause}
                    onSeeked={handleSeeked}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    controlsList="nodownload"
                    onTimeUpdate={handleTimeUpdate}
                    disablePictureInPicture
                    className="w-full aspect-video object-contain transition-all duration-300"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-[#151515] border-b border-gray-800">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <VideoOff className="text-white/40" size={28} />
                    </div>
                    <p className="text-sm font-bold text-white max-w-xs leading-relaxed text-center">
                      Bài học này không có video!
                    </p>
                    <p className="text-xs text-white/40 mt-2 text-center">
                      Vui lòng xem nội dung văn bản chi tiết ở bên dưới.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-gray-200">
                <div className="flex flex-wrap items-start gap-6">
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

                  <div className="shrink-0 flex flex-col gap-2">
                    {lesson.videoLength != null && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
                        <Clock size={14} className="text-[#5624d0]" />
                        <span className="font-semibold">
                          {formatDuration(lesson.videoLength)}
                        </span>
                      </div>
                    )}
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
