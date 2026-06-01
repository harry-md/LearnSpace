import React, { useContext, useState } from "react";
import {
  Trash2,
  ShoppingBag,
  Users,
  PlayCircle,
  BookOpen,
  MessageCircle,
  Phone,
} from "lucide-react";
import { CartContext, UIContext, UserContext } from "../../configs/Context";
import { authApis, endpoints } from "@/configs/Apis";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, cartDispatch] = useContext(CartContext);
  const [, uiDispatch] = useContext(UIContext);
  const [user] = useContext(UserContext);
  const cartItems = cart?.carts || [];
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const nav = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const removeCourseFromCart = (courseId) => {
    cartDispatch({ type: "REMOVE_COURSE", payload: { id: courseId } });
  };

  const handleCheckout = async () => {
    if (!user) {
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Thông báo",
          message: "Vui lòng đăng nhập để thanh toán",
          type: "info",
          onConfirm: () => {
            uiDispatch({ type: "HIDE_DIALOG" });
            nav("/login");
          },
        },
      });
      return;
    }
    if (cartItems.length === 0) {
      return;
    }

    setIsProcessing(true);
    try {
      // Map to format [{ courseId: 100 }, ...]
      const payload = cartItems.map((item) => ({ courseId: item.id }));

      const res = await authApis(user.token).post(endpoints.checkout, payload);

      if (res.data && res.data.approvalUrl) {
        window.location.href = res.data.approvalUrl;
      } else {
        setIsProcessing(false);
        alert("Không nhận được đường dẫn thanh toán từ máy chủ.");
      }
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message);
      console.error(
        "Lỗi khi thanh toán chi tiết:",
        error.response?.data || error,
      );
      uiDispatch({
        type: "SHOW_DIALOG",
        payload: {
          title: "Lỗi",
          message: errorMessage,
          type: "error",
          onConfirm: () => {
            uiDispatch({ type: "HIDE_DIALOG" });
          },
        },
      });
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-gray-900 h-[calc(100vh-110px)] flex flex-col overflow-hidden">
      {/* Header section of Cart Page */}
      <div className="shrink-0 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 sm:pt-8 sm:pb-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1 sm:mb-1.5">
          Giỏ hàng của bạn
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Bạn đang có{" "}
          <strong className="text-purple-700">
            {cartItems.length} khóa học
          </strong>{" "}
          trong giỏ hàng.
        </p>
      </div>

      {/* Main Content Area */}
      {/* Mobile: scroll entire main. Desktop (lg): hide main scroll, scroll left column only */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 w-full flex flex-col lg:flex-row gap-5">
        {/* Left Column: Cart Items Wrapper */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-lg shadow-purple-900/5 p-4 sm:p-5 overflow-hidden h-fit lg:max-h-full mb-6 lg:mb-0">
          <div className="flex justify-between items-center mb-2 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">
              Chi tiết giỏ hàng
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {cartItems.length} khóa học
            </span>
          </div>

          <div className="flex-1 lg:overflow-y-auto pr-1 sm:pr-2 scrollbar-hide space-y-0">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 py-3 sm:py-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2"
              >
                {/* Image */}
                <div className="w-full sm:w-[150px] lg:w-[160px] shrink-0 relative rounded-lg overflow-hidden bg-gray-100 aspect-video sm:h-[90px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.category && (
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-2 py-0.5 rounded-full bg-purple-600/90 text-white shadow-sm backdrop-blur-sm">
                      {item.category.name}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="!text-sm !sm:text-base font-bold text-gray-900 mb-1 leading-tight truncate">
                    {item.name}
                  </h3>

                  {item.teacher && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <img
                        src={item.teacher.avatar}
                        alt={item.teacher.fullName}
                        className="w-4 h-4 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-[11px] sm:text-xs text-gray-600 font-medium truncate">
                        {item.teacher.fullName}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-medium text-gray-500 mt-auto">
                    <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-1 rounded-md">
                      <BookOpen size={10} className="text-blue-500" />
                      {item.chapterCount} chương
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-1 rounded-md">
                      <PlayCircle size={10} className="text-emerald-500" />
                      {item.lessonCount} bài học
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-1 rounded-md">
                      <Users size={10} className="text-orange-500" />
                      {item.enrollmentCount} học viên
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-gray-100 shrink-0 sm:min-w-[160px]">
                  <div className="text-base font-black text-slate-900">
                    {item.price === 0
                      ? "Miễn phí"
                      : `${item.price.toLocaleString("vi-VN")} VNĐ`}
                  </div>

                  <button
                    onClick={() => {
                      removeCourseFromCart(item.id);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-md shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 h-fit bg-white rounded-xl border border-gray-100 shadow-lg shadow-purple-900/5 p-4 sm:p-5 mb-6 lg:mb-0">
          <h2 className="!text-base !font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
            Tổng quan đơn hàng
          </h2>

          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 font-medium">
              <span>Tạm tính ({cartItems.length} khóa)</span>
              <span>{totalPrice.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="pt-2.5 border-t border-gray-100 flex justify-between items-end">
              <span className="text-gray-900 font-bold text-sm">Tổng cộng</span>
              <span className="text-lg sm:text-xl font-black text-purple-700">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className={`w-full text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md ${
              isProcessing || cartItems.length === 0
                ? "bg-slate-400 cursor-not-allowed shadow-none"
                : "bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-purple-600/25"
            }`}
          >
            {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
            {!isProcessing && <ShoppingBag size={16} />}
          </button>

          {/* Phone Support Button */}
          <a
            href="tel:0123456789"
            className="w-full mt-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 font-bold text-sm py-2.5 px-4 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 !no-underline"
          >
            <Phone size={16} />
            Liên hệ hỗ trợ: 0123456789
          </a>

          <p className="text-center text-[9px] sm:text-[10px] text-gray-500 mt-3 font-medium leading-relaxed">
            Bằng việc tiến hành thanh toán, bạn đồng ý với Điều khoản dịch vụ và
            Chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </main>

      {/* Hide scrollbar styles */}
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

export default CartPage;
