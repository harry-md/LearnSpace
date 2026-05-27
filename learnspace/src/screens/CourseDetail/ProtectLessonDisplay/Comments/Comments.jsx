import { MessageCircle, MessageSquare, ThumbsUp } from "lucide-react";
import React from "react";

const Comments = () => {
  return (
    <div className="px-5 py-6 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-[#5624d0]" />
        <h4 className="font-bold text-[#1c1d1f] text-sm">Bình luận (12)</h4>
      </div>

      {/* Input area */}
      <div className="flex gap-3 mb-6">
        <img
          src="https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png"
          alt="User"
          className="w-8 h-8 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex-1">
          <textarea
            placeholder="Có thắc mắc gì về bài học này không? Đặt câu hỏi tại đây..."
            className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5624d0] focus:ring-1 focus:ring-[#5624d0] resize-none h-16 transition-all bg-white"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="px-4 py-1.5 bg-[#5624d0] hover:bg-[#4712c4] text-white text-xs font-bold rounded transition-colors cursor-pointer">
              Gửi bình luận
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-5">
        <div className="flex gap-3">
          <img
            src="https://placehold.co/100x100/e2e8f0/64748b?text=H"
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-200 shrink-0"
          />
          <div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-bold text-[13px] text-[#1c1d1f]">
                Hoàng Nguyễn
              </span>
              <span className="text-[10px] text-gray-500">2 ngày trước</span>
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed mb-1.5">
              Thầy giảng phần này dễ hiểu quá, cám ơn thầy ạ!
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-[11px] font-medium">
              <button className="flex items-center gap-1.5 hover:text-[#5624d0] transition-colors cursor-pointer">
                <ThumbsUp size={13} /> Hữu ích
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#5624d0] transition-colors cursor-pointer">
                <MessageCircle size={13} /> Phản hồi
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <img
            src="https://placehold.co/100x100/fecdd3/e11d48?text=A"
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-200 shrink-0"
          />
          <div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-bold text-[13px] text-[#1c1d1f]">
                Anh Trần
              </span>
              <span className="text-[10px] text-gray-500">5 ngày trước</span>
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed mb-1.5">
              Em bị lỗi "Cannot read properties of undefined" ở phút 12:05,
              không biết fix thế nào ạ?
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-[11px] font-medium">
              <button className="flex items-center gap-1.5 hover:text-[#5624d0] transition-colors cursor-pointer">
                <ThumbsUp size={13} /> Hữu ích
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#5624d0] transition-colors cursor-pointer">
                <MessageCircle size={13} /> Phản hồi
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 mt-6 border border-gray-300 bg-white hover:bg-gray-50 text-[#1c1d1f] text-xs font-bold rounded-lg transition-colors cursor-pointer">
        Xem thêm bình luận
      </button>
    </div>
  );
};

export default Comments;
