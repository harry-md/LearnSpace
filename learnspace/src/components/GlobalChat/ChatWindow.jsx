import React, { useContext, useState, useEffect, useRef } from "react";
import { X, Minus, Send } from "lucide-react";
import { ChatContext, UserContext } from "@/configs/Context";
import { db } from "@/configs/Firebase";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";

const ChatWindow = ({ chatData }) => {
  const [, chatDispatch] = useContext(ChatContext);
  const [currentUser] = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Tạo ID phòng chat chung (ID nhỏ đứng trước, ID lớn đứng sau)
  const conversationId = [currentUser?.id, chatData?.id]
    .sort((a, b) => a - b)
    .join("_");

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Lắng nghe lịch sử tin nhắn và Xóa số thông báo chưa đọc
  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = ref(db, `messages/${conversationId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Chuyển Object của Firebase thành Array
        const msgList = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });

    // Khi mở cửa sổ chat, reset unread về 0
    const myConversationRef = ref(
      db,
      `userConversations/${currentUser.id}/${chatData.id}/unread`,
    );
    set(myConversationRef, 0);

    return () => unsubscribe();
  }, [conversationId, currentUser, chatData.id]);

  const handleClose = () => {
    chatDispatch({ type: "CLOSE_CHAT", payload: chatData.id });
  };

  const handleMinimize = () => {
    chatDispatch({ type: "TOGGLE_MINIMIZE", payload: chatData.id });
  };

  // 2. Gửi tin nhắn
  const handleSend = async () => {
    if (!message.trim() || !currentUser) return;

    const textToSend = message.trim();
    setMessage(""); // Xóa input ngay lập tức cho mượt

    try {
      // 2.1 Đẩy tin nhắn vào mảng chung
      const messagesRef = ref(db, `messages/${conversationId}`);
      await push(messagesRef, {
        text: textToSend,
        senderId: currentUser.id,
        timestamp: serverTimestamp(), // Lấy giờ chuẩn từ server Firebase
      });

      // 2.2 Cập nhật lại "Tin nhắn gần nhất" cho menu chat của MÌNH
      await set(ref(db, `userConversations/${currentUser.id}/${chatData.id}`), {
        lastMessage: textToSend,
        timestamp: serverTimestamp(),
        unread: 0,
      });

      // 2.3 Cập nhật lại "Tin nhắn gần nhất" và Tăng số thông báo cho NGƯỜI NHẬN
      // Cần lấy ra unread hiện tại của người nhận trước (Tùy chọn nâng cao)
      // Để đơn giản, ta gán cứng unread = 1 nếu có tin nhắn mới (chờ họ mở)
      await set(ref(db, `userConversations/${chatData.id}/${currentUser.id}`), {
        lastMessage: textToSend,
        timestamp: serverTimestamp(),
        unread: 1,
        // Gửi kèm thông tin của MÌNH để Header của bên kia biết ai đang nhắn
        senderName: currentUser.firstName + " " + currentUser.lastName, // Hoặc currentUser.username tùy BE của bạn
        senderAvatar: currentUser.avatar || "https://placehold.co/100",
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn", error);
    }
  };

  if (chatData.isMinimized) {
    return (
      <div
        onClick={handleMinimize}
        className="w-[300px] h-12 bg-white rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border border-gray-200 border-b-0 flex items-center justify-between px-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative">
            <img
              src={chatData.avatar || "https://placehold.co/100x100"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
          </div>
          <div className="font-semibold text-sm text-gray-800 truncate">
            {chatData.teacherName}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[330px] h-[450px] bg-white rounded-t-xl shadow-[0_-5px_25px_rgba(0,0,0,0.15)] border border-gray-200 border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-3 bg-white shrink-0 shadow-sm z-10">
        <div
          className="flex items-center gap-2 cursor-pointer w-full overflow-hidden"
          onClick={handleMinimize}
        >
          <div className="relative shrink-0">
            <img
              src={chatData.avatar || "https://placehold.co/100"}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[14px] text-gray-900 leading-tight truncate">
              {chatData.teacherName}
            </span>
            <span className="text-[11px] text-gray-500 leading-tight">
              Đang hoạt động
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-purple-600 shrink-0">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 bg-white scrollbar-hide">
        <div className="flex justify-center my-4">
          <div className="flex flex-col items-center gap-1">
            <img
              src={chatData.avatar || "https://placehold.co/100"}
              className="w-16 h-16 rounded-full object-cover shadow-sm"
              alt="avatar"
            />
            <div className="font-bold text-gray-900 mt-1">
              {chatData.teacherName}
            </div>
            <div className="text-xs text-gray-500">
              Giáo viên / Học viên trên LearnSpace
            </div>
          </div>
        </div>

        {/* Render tin nhắn */}
        {messages.map((msg, index) => {
          const isMine = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id || index}
              className={`flex gap-2 ${isMine ? "justify-end" : ""}`}
            >
              {!isMine && (
                <img
                  src={chatData.avatar || "https://placehold.co/100"}
                  className="w-7 h-7 rounded-full shrink-0 object-cover mt-auto"
                  alt="avatar"
                />
              )}
              <div
                className={`${
                  isMine
                    ? "bg-purple-600 text-white rounded-2xl rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none"
                } text-[14px] p-2.5 max-w-[75%] leading-relaxed break-words`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {/* Điểm neo để cuộn xuống cuối */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative bg-gray-100 rounded-2xl">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhắn tin..."
              className="w-full bg-transparent border-none focus:outline-none resize-none py-2 px-3 text-[14px] text-gray-800 max-h-[80px] min-h-[36px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full shrink-0 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

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

export default ChatWindow;
