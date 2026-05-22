import { PlayCircle, FileQuestion, FileType } from "lucide-react";

export const INITIAL_COURSES = [];

export const LESSON_TYPES = [
  {
    value: "video",
    label: "Video bài giảng",
    icon: PlayCircle,
    color: "text-purple-600",
  },
  {
    value: "quiz",
    label: "Bài kiểm tra",
    icon: FileQuestion,
    color: "text-amber-600",
  },
  {
    value: "doc",
    label: "Tài liệu đọc",
    icon: FileType,
    color: "text-blue-600",
  },
];

export function totalLessons(sections) {
  return (sections || []).reduce((a, s) => a + (s.lessons || []).length, 0);
}
export function newId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
