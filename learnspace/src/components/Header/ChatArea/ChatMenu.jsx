import React, { useContext, useEffect, useState } from "react";
import { Search, X, MoreHorizontal, MessageCircle } from "lucide-react";
import { ChatContext, UserContext } from "@/configs/Context";
import { authApis, endpoints } from "@/configs/Apis";
import { onValue, ref } from "firebase/database";
import { db } from "@/configs/Firebase";
import { Link } from "react-router-dom";

const ChatMenu = ({ onClose }) => {
  const [, chatDispatch] = useContext(ChatContext);
  const [user] = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadContacts = async () => {
    try {
      const res = await authApis(user?.token).get(endpoints.chatContacts);
      setContacts(res.data);
    } catch (err) {
      console.log("Lỗi lấy danh sách liên hệ", err);
    }
  };

  const listenRealtimeConversation = () => {
    const conversationsRef = ref(db, `userConversations/${user.id}`);
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setConversations(data);
      } else {
        setConversations({});
      }
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    if (user) loadContacts();
    if (user) listenRealtimeConversation();
  }, [user]);

  const mergedChats = contacts
    .map((contact) => {
      const firebaseData = conversations[contact.id] || {};
      return {
        ...contact,
        lastMessage:
          firebaseData.lastMessage || "Nhấn để bắt đầu trò chuyện...",
        time: firebaseData.timestamp
          ? new Date(firebaseData.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        unread: firebaseData.unread || 0,
        timestamp: firebaseData.timestamp || 0,
      };
    })
    .filter((c) => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="absolute right-0 top-full mt-3 w-[360px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 flex flex-col max-h-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
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

      {/* --- PHẦN LOGIC ĐIỀU HƯỚNG MỚI NẰM Ở ĐÂY --- */}
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white h-[300px]">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="!text-lg font-bold text-gray-900 mb-2">
            Đăng nhập để nhắn tin
          </h3>
          <p className="text-[14px] text-gray-500 mb-6">
            Bạn cần đăng nhập để trò chuyện với học viên và giảng viên trên hệ
            thống.
          </p>
          <Link
            to="/login"
            onClick={onClose} // Nhớ đóng menu chat khi click chuyển trang
            className="!no-underline w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="px-4 py-2 bg-white shrink-0">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm mọi người..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-200 transition-shadow placeholder:text-gray-500 text-gray-900"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide bg-white">
            {mergedChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-[15px]">
                Chưa có người liên hệ nào.
              </div>
            ) : (
              mergedChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    chatDispatch({
                      type: "OPEN_CHAT",
                      payload: {
                        id: chat.id,
                        teacherName: chat.fullName,
                        avatar: chat.avatar,
                      },
                    });
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors relative"
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        chat.avatar ||
                        "https://placehold.co/100x100/4f46e5/ffffff?text=User"
                      }
                      alt={chat.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div
                        className={`text-[15px] ${chat.unread > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-800"} truncate`}
                      >
                        {chat.fullName}
                      </div>
                      <span
                        className={`text-[11px] shrink-0 ml-2 ${chat.unread > 0 ? "text-purple-600 font-bold" : "text-gray-500"}`}
                      >
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
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
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 bg-white text-center shrink-0">
            <button className="text-[15px] font-semibold text-purple-600 hover:bg-gray-50 w-full py-1.5 rounded-lg transition-colors">
              Xem tất cả trong Messenger
            </button>
          </div>
        </>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
};

export default ChatMenu;
