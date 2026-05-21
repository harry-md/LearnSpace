import { PlayCircle, FileQuestion, FileType } from "lucide-react";

export const INITIAL_COURSES = [
  {
    id: 1,
    title: "Cấu trúc dữ liệu & Giải thuật trong Python",
    image: "https://placehold.co/320x180/1e293b/facc15?text=DSA+Python",
    category: "Phát triển",
    level: "Trung cấp",
    price: "499.000 ₫",
    revenue: "641.716.000 ₫",
    status: "published",
    studentsCount: 1284,
    rating: 4.7,
    sections: [
      {
        id: 101,
        title: "Giới thiệu & Cài đặt",
        lessons: [
          {
            id: 1001,
            title: "Giới thiệu khóa học",
            type: "video",
            duration: "8:32",
            isFree: true,
          },
          {
            id: 1002,
            title: "Cài đặt Python & VS Code",
            type: "video",
            duration: "12:15",
            isFree: true,
          },
          {
            id: 1003,
            title: "Phân tích độ phức tạp Big-O",
            type: "video",
            duration: "14:20",
            isFree: false,
          },
        ],
      },
      {
        id: 102,
        title: "Array & Hashing",
        lessons: [
          {
            id: 1004,
            title: "Array cơ bản",
            type: "video",
            duration: "18:05",
            isFree: false,
          },
          {
            id: 1005,
            title: "Two Sum – Bài kinh điển",
            type: "video",
            duration: "22:30",
            isFree: false,
          },
          {
            id: 1006,
            title: "Kiểm tra Array",
            type: "quiz",
            duration: "10 câu",
            isFree: false,
          },
        ],
      },
      {
        id: 103,
        title: "Two Pointers",
        lessons: [
          {
            id: 1007,
            title: "Template Two Pointers",
            type: "video",
            duration: "11:20",
            isFree: false,
          },
          {
            id: 1008,
            title: "Valid Palindrome",
            type: "video",
            duration: "9:55",
            isFree: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "System Design cho Developer Việt Nam",
    image: "https://placehold.co/320x180/7c3aed/ffffff?text=System+Design",
    category: "Phát triển",
    level: "Nâng cao",
    price: "699.000 ₫",
    revenue: "612.924.000 ₫",
    status: "published",
    studentsCount: 876,
    rating: 4.9,
    sections: [
      {
        id: 201,
        title: "Nền tảng System Design",
        lessons: [
          {
            id: 2001,
            title: "CAP Theorem",
            type: "video",
            duration: "20:10",
            isFree: true,
          },
          {
            id: 2002,
            title: "Load Balancing",
            type: "video",
            duration: "25:40",
            isFree: false,
          },
        ],
      },
      {
        id: 202,
        title: "Database Design",
        lessons: [
          {
            id: 2003,
            title: "SQL vs NoSQL",
            type: "video",
            duration: "18:30",
            isFree: false,
          },
          {
            id: 2004,
            title: "Indexing & Sharding",
            type: "video",
            duration: "30:15",
            isFree: false,
          },
          {
            id: 2005,
            title: "Quiz Database",
            type: "quiz",
            duration: "15 câu",
            isFree: false,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "AWS Cloud Practitioner – Luyện thi CLF-C02",
    image: "https://placehold.co/320x180/f97316/ffffff?text=AWS+CLF",
    category: "CNTT & Phần mềm",
    level: "Cơ bản",
    price: "349.000 ₫",
    revenue: "0 ₫",
    status: "draft",
    studentsCount: 0,
    rating: 0,
    sections: [
      {
        id: 301,
        title: "Giới thiệu AWS",
        lessons: [
          {
            id: 3001,
            title: "AWS là gì?",
            type: "video",
            duration: "10:00",
            isFree: true,
          },
        ],
      },
    ],
  },
];

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

export const CATEGORIES = [
  "Phát triển",
  "Kinh doanh",
  "CNTT & Phần mềm",
  "Thiết kế",
  "Marketing",
  "Phát triển cá nhân",
];
export const LEVELS = ["Cơ bản", "Trung cấp", "Nâng cao", "Mọi cấp độ"];

export function totalLessons(sections) {
  return sections.reduce((a, s) => a + s.lessons.length, 0);
}
export function newId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
