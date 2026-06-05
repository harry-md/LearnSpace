import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { CartContext } from "@/configs/Context";

const PaymentSuccessPage = () => {
  const [, cartDispatch] = useContext(CartContext);

  useEffect(() => {
    cartDispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Thanh toán thành công!
          </h2>
          <Link
            to="/learning"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
          >
            Bắt đầu học
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
