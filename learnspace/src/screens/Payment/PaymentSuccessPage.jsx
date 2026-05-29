import React, { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { authApis, endpoints } from "@/configs/Apis";
import { UserContext, CartContext } from "@/configs/Context";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [user] = useContext(UserContext);
  const [, cartDispatch] = useContext(CartContext);

  const [status, setStatus] = useState("processing"); // 'processing', 'success', 'error'
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    if (hasCaptured.current) return;
    hasCaptured.current = true;

    const capturePayment = async () => {
      try {
        await authApis(user?.token).post(endpoints.capturePayment(token));
        // Clear cart after successful payment
        cartDispatch({ type: "CLEAR_CART" });
        setStatus("success");
      } catch (error) {
        console.error(
          "Lỗi khi capture payment chi tiết:",
          error.response?.data || error,
        );

        const errorDataStr = JSON.stringify(error.response?.data || "");
        if (errorDataStr.includes("ORDER_ALREADY_CAPTURED")) {
          // If already captured (perhaps due to StrictMode race conditions), treat as success
          cartDispatch({ type: "CLEAR_CART" });
          setStatus("success");
        } else {
          setStatus("error");
        }
      }
    };

    capturePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.token]);

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
        {status === "processing" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Loader2 size={40} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Đang xử lý thanh toán
            </h2>
            <p className="text-slate-500">
              Vui lòng không đóng trình duyệt trong quá trình này...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-slate-500 mb-8">
              Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ.
            </p>

            <Link
              to="/learning"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
            >
              Vào không gian học tập
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-slate-500 mb-8">
              Đã có lỗi xảy ra hoặc giao dịch bị hủy bỏ. Vui lòng thử lại sau.
            </p>

            <button
              onClick={() => navigate("/cart")}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
