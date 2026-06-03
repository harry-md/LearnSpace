import React, { useContext, useState, useRef } from "react";
import { UserContext } from "@/configs/Context";
import moment from "moment/min/moment-with-locales";
import {
  Pencil,
  Save,
  X,
  User,
  Mail,
  Shield,
  CheckCircle,
  Calendar,
  Upload,
  Camera,
  AlertTriangle,
} from "lucide-react";

const ProfilePage = () => {
  const [user, dispatchUser] = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar || "");
      setAvatarFile(null);
    }
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      if (!isEditing) {
        setIsEditing(true);
      }
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError("Vui lòng điền đầy đủ Họ và tên và Email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Địa chỉ email không hợp lệ.");
      return;
    }

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      avatar: avatarPreview || user?.avatar,
    };

    dispatchUser({
      type: "LOGIN",
      payload: updatedUser,
    });

    setIsEditing(false);
    setSuccess("Cập nhật thông tin hồ sơ thành công!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "TEACHER":
        return "Giảng viên";
      case "STUDENT":
      default:
        return "Học viên";
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-gray-500 font-sans">
        <User size={64} className="mb-4 text-gray-300 animate-pulse" />
        <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
        <p className="text-sm">
          Bạn cần đăng nhập để xem thông tin hồ sơ cá nhân.
        </p>
      </div>
    );
  }

  const displayFullName = user.fullName || user.username;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-[#1c1d1f] pb-16">
      <div className="bg-white border-b border-gray-100 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Hồ sơ cá nhân
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin tài khoản, ảnh đại diện và vai trò của bạn trên
              LearnSpace.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col items-center">
              <div
                className={`relative group mb-6 rounded-full overflow-hidden ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={displayFullName}
                    className={`w-[150px] h-[150px] object-cover rounded-full shadow-md border-4 border-white ring-1 ring-gray-200 transition-all duration-300 ${
                      isEditing ? "group-hover:opacity-80" : ""
                    }`}
                  />
                ) : (
                  <div className="w-[150px] h-[150px] bg-slate-900 text-white rounded-full flex items-center justify-center text-[54px] font-bold shadow-md border-4 border-white ring-1 ring-gray-200">
                    {(
                      (user.fullName && user.fullName[0]) ||
                      (user.username && user.username[0]) ||
                      "U"
                    ).toUpperCase()}
                  </div>
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Camera size={20} className="mb-1" />
                    <span>Thay đổi ảnh</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mb-5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
                >
                  <Upload size={13} />
                  Chọn ảnh từ máy
                </button>
              )}

              <div className="text-center w-full pb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-lg text-gray-900 leading-tight">
                  {displayFullName}
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  @{user.username}
                </p>
              </div>

              <div className="w-full pt-4 space-y-3.5 text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Shield size={16} className="text-gray-400" />
                  <span>
                    Vai trò:{" "}
                    <strong className="text-gray-900">
                      {getRoleLabel(user.role)}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    Tham gia:{" "}
                    <strong className="text-gray-900">
                      {user.createdAt
                        ? moment(user.createdAt).locale("vi").fromNow()
                        : "N/A"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn animate-duration-300">
                <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                <span className="font-semibold">{success}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl flex items-center gap-2.5 animate-fadeIn animate-duration-300">
                <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 md:p-8">
              <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2.5">
                <User size={18} className="text-purple-600" />
                Thông tin cá nhân
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      Tên đăng nhập (Cố định)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.username}
                      className="w-full text-base font-bold text-gray-450 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 cursor-not-allowed outline-none select-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      Vai trò hệ thống (Cố định)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={getRoleLabel(user.role)}
                      className="w-full text-base font-bold text-gray-455 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 cursor-not-allowed outline-none select-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-base font-medium text-gray-800 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-250"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <div className="text-base font-medium text-gray-800 px-4 py-3 bg-white rounded-xl border border-gray-200/80">
                        {user.fullName || "Chưa thiết lập"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-base font-medium text-gray-800 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-250"
                      placeholder="example@mail.com"
                    />
                  ) : (
                    <div className="text-base font-medium text-gray-800 px-4 py-3 bg-white rounded-xl border border-gray-200/80 flex items-center gap-2.5">
                      <Mail size={16} className="text-gray-400 shrink-0" />
                      {user.email}
                    </div>
                  )}
                </div>

                {user.role === "TEACHER" && (
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      Trạng thái xác minh tài khoản
                    </label>
                    {user.verified ? (
                      <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-800 text-sm">
                        <CheckCircle
                          size={20}
                          className="text-emerald-500 shrink-0 mt-0.5"
                        />
                        <div>
                          <strong className="block font-bold">
                            Đã xác minh chính thức
                          </strong>
                          <span className="text-xs text-emerald-600/90 mt-0.5 block">
                            Hồ sơ giảng viên của bạn đã được quản trị viên phê
                            duyệt chính thức.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-100 rounded-xl text-amber-800 text-sm">
                        <AlertTriangle
                          size={20}
                          className="text-amber-500 shrink-0 mt-0.5"
                        />
                        <div>
                          <strong className="block font-bold">
                            Chưa xác minh
                          </strong>
                          <span className="text-xs text-amber-600/90 mt-0.5 block">
                            Hồ sơ của bạn đang chờ phê duyệt. Bạn vẫn có thể
                            chuẩn bị nội dung khóa học.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="px-6 py-2.5 bg-[#5624d0] hover:bg-[#401b9c] active:scale-95 text-white font-extrabold rounded-lg text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Pencil size={15} strokeWidth={2.5} />
                      Chỉnh sửa hồ sơ
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 font-bold rounded-lg text-[14px] flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <X size={15} />
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#5624d0] hover:bg-[#401b9c] active:scale-95 text-white font-extrabold rounded-lg text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <Save size={15} />
                        Lưu thay đổi
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
