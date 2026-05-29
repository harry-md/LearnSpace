import React, { useContext } from "react";
import { Search, X, MoreHorizontal } from "lucide-react";
import { ChatContext } from "@/configs/Context";

const ChatMenu = ({ onClose }) => {
  const [, chatDispatch] = useContext(ChatContext);

  const mockConversations = [
    {
      id: 1,
      teacherName: "Nguyễn Văn A",
      courseName: "Khóa học ReactJS Cơ bản",
      avatar: "https://placehold.co/100x100/4f46e5/ffffff?text=A",
      lastMessage: "Cảm ơn bạn đã đăng ký khóa học!",
      time: "2 giờ trước",
      unread: 1,
    },
    {
      id: 2,
      teacherName: "Trần Thị B",
      courseName: "Lập trình Flutter",
      avatar: "https://placehold.co/100x100/0ea5e9/ffffff?text=B",
      lastMessage: "Bạn làm bài tập phần này chưa?",
      time: "1 ngày trước",
      unread: 0,
    },
    {
      id: 3,
      teacherName: "Lê Văn C",
      courseName: "NodeJS Mastery",
      avatar: "https://placehold.co/100x100/10b981/ffffff?text=C",
      lastMessage: "Video bài 5 đã được cập nhật nhé.",
      time: "3 ngày trước",
      unread: 0,
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-3 w-[360px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 flex flex-col max-h-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="font-extrabold text-2xl text-gray-900">Đoạn chat</div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 bg-white">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-200 transition-shadow placeholder:text-gray-500 text-gray-900"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide bg-white">
        {mockConversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              chatDispatch({ type: "OPEN_CHAT", payload: chat });
              onClose();
            }}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors relative"
          >
            <div className="relative shrink-0">
              <img
                src={chat.avatar}
                alt={chat.teacherName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <div
                  className={`text-[15px] ${chat.unread > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-800"} truncate`}
                >
                  {chat.teacherName}
                </div>
                <span
                  className={`text-[11px] shrink-0 ml-2 ${chat.unread > 0 ? "text-purple-600 font-bold" : "text-gray-500"}`}
                >
                  {chat.time}
                </span>
              </div>

              <div className="text-[12px] text-purple-600 font-semibold truncate mb-0.5">
                {chat.courseName}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div
                  className={`text-[13px] truncate ${chat.unread > 0 ? "font-semibold text-gray-900" : "text-gray-500"}`}
                >
                  {chat.lastMessage}
                </div>
                {chat.unread > 0 && (
                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full shrink-0"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-white text-center">
        <button className="text-[15px] font-semibold text-purple-600 hover:bg-gray-50 w-full py-1.5 rounded-lg transition-colors">
          Xem tất cả trong Messenger
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
};

export default ChatMenu;
