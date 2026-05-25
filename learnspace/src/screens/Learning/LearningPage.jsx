import React, { useState } from "react";
import {
  Clock,
  Flame,
  Info,
  Calendar,
  Plus,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  Award,
  ListPlus,
  Compass,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseHoverDetail from "../../components/CourseHoverDetail/CourseHoverDetail";

// MOCK DATA FOR COURSES
const mockEnrolledCourses = [
  {
    id: 1,
    title: "Lập Trình Python Từ Cơ Bản Đến Nâng Cao Trong 30 Ngày",
    author: "AI Coding",
    image: "https://placehold.co/400x225/1e3a8a/ffffff?text=Python",
    progress: 34,
    totalLectures: 88,
    completedLectures: 30,
    rating: 4.6,
  },
  {
    id: 2,
    title: "AWS Cloud for beginner (Vietnamese)",
    author: "Linh Nguyen",
    image: "https://placehold.co/400x225/f97316/ffffff?text=AWS",
    progress: 80,
    totalLectures: 45,
    completedLectures: 36,
    rating: 4.7,
  },
  {
    id: 3,
    title: "AWS Certified Solutions Architect - Associate (Tiếng Việt)",
    author: "Luu Ha Phuong",
    image: "https://placehold.co/400x225/eab308/ffffff?text=AWS+Architect",
    progress: 8,
    totalLectures: 120,
    completedLectures: 10,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Từ vựng tiếng Anh thiết yếu",
    author: "Hải Trần Phi",
    image: "https://placehold.co/400x225/4b5563/ffffff?text=English",
    progress: 100,
    totalLectures: 50,
    completedLectures: 50,
    rating: 4.6,
  },
];


const mockWishlistCourses = [
  {
    id: 5,
    title: "PMP - Luyện thi chứng chỉ cấp tốc, 35pdu tiếng Việt",
    author: "Master Lee Education",
    rating: 4.8,
    reviews: "218",
    price: "1.599.000 ₫",
    image: "https://placehold.co/400x225/334155/ffffff?text=PMP",
  },
];

const categories = [
  "Phát triển",
  "Kinh doanh",
  "Tài chính & Kế toán",
  "CNTT & Phần mềm",
  "Năng suất văn phòng",
  "Phát triển cá nhân",
  "Thiết kế",
  "Marketing",
  "Sức khỏe & Thể dục",
  "Âm nhạc",
];

const LearningPage = () => {
  // STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("Tất cả khóa học");
  const [showMockCourses, setShowMockCourses] = useState(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  
  // Simulated Streak Metrics
  const [streakWeeks, setStreakWeeks] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [visitCount, setVisitCount] = useState(1); // Mặc định trong hình là 1/1 lượt truy cập
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Custom Scheduler State
  const [schedulerSaved, setSchedulerSaved] = useState(false);
  const [schedulerDays, setSchedulerDays] = useState(["T2", "T4", "T6"]);
  const [schedulerTime, setSchedulerTime] = useState("19:30");
  const [schedulerReminder, setSchedulerReminder] = useState(true);

  // Custom User Lists State
  const [userLists, setUserLists] = useState([
    { id: 1, name: "Chuẩn bị thi AWS Cloud Practitioner", coursesCount: 2 },
    { id: 2, name: "Lập trình Web nâng cao", coursesCount: 0 },
  ]);
  const [newListName, setNewListName] = useState("");
  const [showAddListForm, setShowAddListForm] = useState(false);

  // FUNCTIONS
  const handleSimulateStudy = () => {
    if (studyMinutes < 30) {
      const nextMinutes = studyMinutes + 5;
      setStudyMinutes(nextMinutes);
      
      // Goal reached
      if (nextMinutes === 30) {
        setStreakWeeks(1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  };

  const handleResetStreak = () => {
    setStudyMinutes(0);
    setStreakWeeks(0);
    setVisitCount(0);
  };

  const toggleDaySelection = (day) => {
    if (schedulerDays.includes(day)) {
      setSchedulerDays(schedulerDays.filter((d) => d !== day));
    } else {
      setSchedulerDays([...schedulerDays, day]);
    }
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (schedulerDays.length === 0) {
      alert("Vui lòng chọn ít nhất một ngày học trong tuần!");
      return;
    }
    setSchedulerSaved(true);
    setShowSchedulerModal(false);
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now(),
      name: newListName,
      coursesCount: 0,
    };
    setUserLists([...userLists, newList]);
    setNewListName("");
    setShowAddListForm(false);
  };

  const handleDeleteList = (id) => {
    setUserLists(userLists.filter((list) => list.id !== id));
  };

  // SVGs / Circular Progress calculations
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  // Orange ring representing minutes (Goal is 30)
  const minuteProgress = Math.min(studyMinutes / 30, 1);
  const strokeDashoffsetMinutes = circumference - minuteProgress * circumference;
  // Green ring representing visits (Goal is 1)
  const visitProgress = Math.min(visitCount / 1, 1);
  const strokeDashoffsetVisits = circumference - visitProgress * circumference;

  return (
    <div className="min-h-screen bg-[#f7f9fa] font-sans text-gray-900 flex flex-col">
      {/* Confetti Micro-animation Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center animate-bounce bg-white/95 border border-purple-200 p-6 rounded-2xl shadow-2xl backdrop-blur-sm max-w-sm mx-auto">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-3 animate-spin" />
            <h3 className="text-2xl font-black text-purple-700">Chúc mừng bạn!</h3>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Bạn đã hoàn thành mục tiêu 30 phút học tập hôm nay và bắt đầu chuỗi học tập hàng tuần!
            </p>
          </div>
        </div>
      )}

      {/* 2. SUB-HEADER / DARK BANNER */}
      <section className="bg-[#1c1d1f] text-white pt-8 px-6 md:px-12 border-b border-gray-800 shrink-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight mb-8">
            Học tập
          </h2>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none pb-0">
            {[
              "Tất cả khóa học",
              "Danh sách của tôi",
              "Danh sách mong ước",
              "Lộ trình học tập",
              "Đã lưu trữ",
              "Công cụ học tập",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm md:text-base font-bold whitespace-nowrap border-b-[3px] transition-all duration-300 relative cursor-pointer outline-none ${
                  activeTab === tab
                    ? "border-white text-white font-black"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:px-12">
        
        {/* --- TAB CONTENT: TẤT CẢ KHÓA HỌC --- */}
        {activeTab === "Tất cả khóa học" && (
          <div className="space-y-6 max-w-5xl mx-auto animate-[fadeIn_0.4s_ease-out]">
            
            {/* CARD 1: WEEKLY STREAK (Bắt đầu chuỗi tuần) */}
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6">
                {/* Left Description info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#1c1d1f] tracking-tight">
                      Bắt đầu một chuỗi hàng tuần
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      Xem 5 phút video mỗi ngày để đạt được mục tiêu của bạn.
                    </p>
                  </div>

                  {/* Simulations & Controls for Interactive Wow factor */}
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button 
                      onClick={handleSimulateStudy}
                      disabled={studyMinutes >= 30}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        studyMinutes >= 30 
                          ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" 
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95"
                      }`}
                    >
                      <Sparkles size={14} className={studyMinutes < 30 ? "animate-pulse" : ""} />
                      {studyMinutes >= 30 ? "Đã đạt mục tiêu hôm nay (+30p)" : "Học thử 5 phút video"}
                    </button>
                    {(studyMinutes > 0 || streakWeeks > 0) && (
                      <button 
                        onClick={handleResetStreak}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition-all active:scale-95"
                      >
                        Reset tiến trình
                      </button>
                    )}
                  </div>
                </div>

                {/* Center Streak count */}
                <div className="flex flex-col items-center justify-center px-6 md:border-l md:border-r border-gray-200 shrink-0">
                  <div className="relative group">
                    <Flame 
                      className={`w-12 h-12 transition-all duration-500 ${
                        streakWeeks > 0 
                          ? "text-orange-500 fill-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" 
                          : "text-gray-300"
                      }`} 
                    />
                    {streakWeeks > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <span className="block text-2xl font-black text-[#1c1d1f]">
                      {streakWeeks} tuần
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Chuỗi hiện tại</span>
                  </div>
                </div>

                {/* Right Ring Chart representation */}
                <div className="flex items-center gap-6 shrink-0 bg-gray-50 p-4 rounded-lg border border-gray-100 w-full md:w-auto">
                  {/* SVG Circle Progress */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                      {/* Track Ring */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="5"
                      />
                      {/* Green Ring (Visits: Completed) */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffsetVisits}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-in-out"
                      />
                      {/* Orange Ring (Minutes: Incrementable) */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius - 6} // hơi thu nhỏ để tạo hiệu ứng vòng lồng đồng tâm tuyệt đẹp
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * (radius - 6)}
                        strokeDashoffset={2 * Math.PI * (radius - 6) - (minuteProgress * 2 * Math.PI * (radius - 6))}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-in-out"
                      />
                    </svg>
                    {/* Center Icon / Inner dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#10b981]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Legend text info */}
                  <div className="flex-1 text-left text-xs font-semibold space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] block"></span>
                      <span className="text-[#2d2f31]">{studyMinutes}/30 phút khóa học</span>
                      <Info size={13} className="text-gray-400 cursor-pointer hover:text-gray-600" title="Thời lượng tích lũy xem bài học hôm nay" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] block"></span>
                      <span className="text-[#2d2f31]">{visitCount}/1 lượt truy cập</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wide">
                      17 thg 5 - 24
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: STUDY SCHEDULER (Lên lịch thời gian học) */}
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1c1d1f] tracking-tight">
                    Lên lịch thời gian học
                  </h3>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed max-w-4xl">
                    Học một chút mỗi ngày sẽ giúp bạn tích lũy kiến thức. Nghiên cứu cho thấy rằng những học viên biến việc học thành thói quen sẽ có nhiều khả năng đạt được mục tiêu hơn. Hãy dành thời gian để học và nhận lời nhắc bằng cách sử dụng trình lên lịch học tập.
                  </p>
                  
                  {/* Active Schedule Badge if user has saved one */}
                  {schedulerSaved && (
                    <div className="mt-3.5 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3 w-fit text-sm text-emerald-800 font-medium animate-[slideDown_0.3s_ease-out]">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        Đã đặt lịch học: <span className="font-extrabold">{schedulerDays.join(", ")}</span> lúc <span className="font-extrabold">{schedulerTime}</span>
                        {schedulerReminder && " (Đã kích hoạt nhắc nhở)"}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center">
                    <button 
                      onClick={() => setShowSchedulerModal(true)}
                      className="px-4 py-2 border border-[#5624d0] text-[#5624d0] hover:bg-purple-50/50 font-bold text-sm rounded transition-colors cursor-pointer"
                    >
                      {schedulerSaved ? "Chỉnh sửa lịch" : "Bắt đầu"}
                    </button>
                    
                    {schedulerSaved ? (
                      <button 
                        onClick={() => setSchedulerSaved(false)}
                        className="text-red-600 hover:text-red-800 font-bold text-sm ml-5 transition-colors cursor-pointer"
                      >
                        Hủy lịch học
                      </button>
                    ) : (
                      <button 
                        className="text-gray-500 hover:text-gray-900 font-bold text-sm ml-5 transition-colors cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TOGGLE SWITCH FOR MOCK ENROLLED COURSES VS EMPTY STATE */}
            <div className="flex justify-between items-center bg-purple-50/50 border border-purple-100 rounded-lg p-4 mt-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600 shrink-0" />
                <span className="text-sm font-semibold text-purple-800">
                  {showMockCourses 
                    ? "Đang mô phỏng giao diện có Khóa học của bạn" 
                    : "Đang mô phỏng giao diện chưa có khóa học (Empty State)"}
                </span>
              </div>
              <button
                onClick={() => setShowMockCourses(!showMockCourses)}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold transition-all shadow active:scale-95"
              >
                {showMockCourses ? "Xem giao diện trống (như trong ảnh)" : "Xem giao diện có khóa học mẫu"}
              </button>
            </div>

            {/* EMPTY STATE OR COURSE GRID */}
            {!showMockCourses ? (
              /* EMPTY STATE (Giống ảnh mẫu hoàn toàn) */
              <div className="text-center py-20 bg-white border border-[#d1d7dc] rounded-lg mt-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="max-w-md mx-auto px-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <Compass className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1c1d1f] tracking-tight">
                    Bắt đầu học ngay hôm nay.
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Khi bạn mua một khóa học, khóa học đó sẽ xuất hiện ở đây.{" "}
                    <Link to="/home" className="text-[#5624d0] hover:text-purple-900 font-bold underline transition-colors cursor-pointer">
                      Duyệt tìm ngay
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              /* COURSE GRID (Khi bật xem khóa học mẫu) */
              <div className="mt-4 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-lg font-bold text-[#1c1d1f] tracking-tight mb-4">
                  Các khóa học của tôi ({mockEnrolledCourses.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockEnrolledCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="bg-white border border-[#d1d7dc] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="px-4 py-2 bg-white/95 rounded-full text-xs font-bold text-gray-900 shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            Tiếp tục học
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-bold text-sm text-[#1c1d1f] line-clamp-2 leading-snug group-hover:text-[#5624d0] transition-colors mb-1.5">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mb-3">{course.author}</p>
                        
                        {/* Progress segment */}
                        <div className="mt-auto space-y-1.5">
                          <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#5624d0] rounded-full transition-all duration-1000"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-[10.5px] font-bold text-gray-500">
                            <span>Đã học {course.progress}%</span>
                            <span>{course.completedLectures}/{course.totalLectures} bài</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: DANH SÁCH CỦA TÔI --- */}
        {activeTab === "Danh sách của tôi" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1c1d1f]">Danh sách của tôi</h3>
                  <p className="text-sm text-gray-600 mt-1">Sắp xếp, phân loại các khóa học để học tập hiệu quả hơn.</p>
                </div>
                
                <button
                  onClick={() => setShowAddListForm(!showAddListForm)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Tạo danh sách mới
                </button>
              </div>

              {/* Inline Form to add list */}
              {showAddListForm && (
                <form onSubmit={handleCreateList} className="bg-gray-50 border border-purple-100 rounded-lg p-4 mb-6 animate-[slideDown_0.3s_ease-out]">
                  <h4 className="text-sm font-bold text-purple-900 mb-2">Tên danh sách mới</h4>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Ví dụ: Lập trình Web fullstack, Ngoại ngữ..."
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Lưu
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowAddListForm(false);
                        setNewListName("");
                      }}
                      className="px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Lists table / collection */}
              {userLists.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-300 rounded-lg">
                  <ListPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Bạn chưa tạo danh sách nào.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-150 border border-gray-200 rounded-lg overflow-hidden">
                  {userLists.map((list) => (
                    <div key={list.id} className="flex justify-between items-center p-4 bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                          L
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#1c1d1f]">{list.name}</h4>
                          <span className="text-xs text-gray-500 font-medium">{list.coursesCount} khóa học</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Xóa danh sách"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: DANH SÁCH MONG ƯỚC --- */}
        {activeTab === "Danh sách mong ước" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#1c1d1f] mb-6">Khóa học trong Danh sách mong ước</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mockWishlistCourses.map((course) => (
                  <div key={course.id} className="flex gap-4 border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-all">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded border border-gray-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#2d2f31] line-clamp-2 hover:text-purple-600 cursor-pointer">{course.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{course.author}</p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="font-extrabold text-sm text-[#1c1d1f]">{course.price}</span>
                        <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded transition-all cursor-pointer">
                          Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: LỘ TRÌNH HỌC TẬP --- */}
        {activeTab === "Lộ trình học tập" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#1c1d1f]">Lộ trình học tập định hướng</h3>
              <p className="text-sm text-gray-600 mt-1 mb-6">Các lộ trình thiết kế sẵn giúp bạn đi từ con số 0 đến cấp độ chuyên gia trong ngành.</p>
              
              <div className="space-y-4">
                {/* Path 1 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:border-purple-500 transition-colors flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-base text-[#1c1d1f]">Trở thành Frontend Web Developer</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">9 Khóa học • 120 giờ • Do các chuyên gia hàng đầu hướng dẫn</p>
                    <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                      Xây dựng nền tảng HTML/CSS vững chắc, làm chủ Javascript và chuyên sâu các thư viện React, Vue hoặc Angular để phát triển giao diện người dùng chuyên nghiệp.
                    </p>
                  </div>
                  
                  <button className="mt-4 md:mt-0 px-4 py-2 border border-purple-600 text-purple-600 font-bold text-xs rounded hover:bg-purple-50 transition-colors shrink-0 cursor-pointer">
                    Khám phá lộ trình
                  </button>
                </div>

                {/* Path 2 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:border-purple-500 transition-colors flex flex-col md:flex-row items-center md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-base text-[#1c1d1f]">Chuyên gia Trí tuệ Nhân tạo & Học máy</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">6 Khóa học • 85 giờ • Hướng dẫn lập trình AI thực tế</p>
                    <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                      Làm quen với toán đại số tuyến tính trong AI, phát triển mô hình Machine Learning với Scikit-Learn, Deep Learning với Tensorflow và xử lý ngôn ngữ tự nhiên.
                    </p>
                  </div>
                  
                  <button className="mt-4 md:mt-0 px-4 py-2 border border-purple-600 text-purple-600 font-bold text-xs rounded hover:bg-purple-50 transition-colors shrink-0 cursor-pointer">
                    Khám phá lộ trình
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: ĐÃ LƯU TRỮ --- */}
        {activeTab === "Đã lưu trữ" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-12 text-center shadow-sm">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#1c1d1f] mb-1">Không có khóa học lưu trữ</h3>
              <p className="text-sm text-gray-500">Các khóa học được lưu trữ để làm gọn danh sách học tập sẽ hiển thị ở đây.</p>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: CÔNG CỤ HỌC TẬP --- */}
        {activeTab === "Công cụ học tập" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#1c1d1f]">Công cụ học tập và Nâng cao thói quen</h3>
                <p className="text-sm text-gray-600 mt-1">Tận dụng tối đa các công cụ nhắc nhở và quản lý tiến độ để chinh phục mục tiêu của bạn.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Reminder Settings Card */}
                <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-base text-[#1c1d1f]">Nhắc nhở học tập hàng ngày</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Bật thông báo đẩy trên trình duyệt hoặc email nhắc nhở vào khung giờ cố định để nhắc bạn dành ra 15-30 phút học mỗi ngày.
                  </p>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-gray-150">
                    <span className="text-xs font-bold text-gray-700">Trạng thái thông báo:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={schedulerReminder} 
                        onChange={(e) => setSchedulerReminder(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5624d0]"></div>
                    </label>
                  </div>
                </div>

                {/* Calendar visualization mockup */}
                <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-base text-[#1c1d1f]">Lịch sử học tập (Tuần này)</h4>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 pt-2">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
                      <div key={day}>
                        <span className="block mb-1">{day}</span>
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                            idx === 4 && studyMinutes >= 30 // Giả sử T6 (hôm nay) là ngày hoàn thành học tập
                              ? "bg-emerald-500 text-white shadow-sm"
                              : schedulerDays.includes(day)
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {idx === 4 && studyMinutes >= 30 ? "✓" : idx + 17}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 pt-1 text-center font-medium">
                    Những ngày được tô màu tím là những ngày bạn đã lên lịch tự học.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER (UDEMY STYLE BRAND FOOTER) */}
      <footer className="bg-[#1c1d1f] text-white pt-10 pb-6 px-6 md:px-12 mt-auto shrink-0 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8">
          <div>
            <h4 className="text-lg font-black text-white tracking-tight">
              Giảng dạy online cho cả thế giới
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Đăng ký trở thành giảng viên trên LearnSpace, chia sẻ kiến thức của bạn với hàng triệu học viên toàn cầu và kiến tạo thêm nguồn thu nhập ổn định.
            </p>
          </div>
          
          <button className="px-5 py-2.5 bg-transparent border border-white hover:bg-white/10 text-white font-bold text-sm transition-colors cursor-pointer shrink-0">
            Giảng dạy trên LearnSpace
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-6 text-[11px] text-gray-400 font-medium">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start">
            <span className="hover:underline cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:underline cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:underline cursor-pointer">Trợ giúp & Hỗ trợ</span>
            <span className="hover:underline cursor-pointer">Liên hệ chúng tôi</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span>© 2026 LearnSpace, Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* --- SCHEDULER POPUP MODAL --- */}
      {showSchedulerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-[zoomIn_0.25s_ease-out]">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#5624d0]" />
                Lên lịch trình học tập tự chọn
              </h3>
              <button 
                onClick={() => setShowSchedulerModal(false)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSchedule} className="p-6 space-y-5 text-sm">
              {/* Day selection row */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">Chọn những ngày bạn muốn học:</label>
                <div className="flex justify-between gap-1.5">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => {
                    const isSelected = schedulerDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`w-10 h-10 rounded-full font-bold text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#5624d0] text-white shadow-sm" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time selection input */}
              <div className="space-y-2">
                <label htmlFor="study-time" className="block font-bold text-gray-700">Khung giờ bắt đầu học:</label>
                <input 
                  type="time" 
                  id="study-time"
                  value={schedulerTime}
                  onChange={(e) => setSchedulerTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-gray-800 font-medium"
                />
              </div>

              {/* Notification toggle inside modal */}
              <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
                <div className="space-y-0.5">
                  <span className="block font-bold text-gray-700">Nhận nhắc nhở trên trình duyệt</span>
                  <span className="text-[11px] text-gray-500">Thông báo nhắc nhở 5 phút trước giờ học.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={schedulerReminder} 
                    onChange={(e) => setSchedulerReminder(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5624d0]"></div>
                </label>
              </div>

              {/* Modal buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowSchedulerModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs shadow-md transition-colors"
                >
                  Lưu lịch học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Animations CSS Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LearningPage;
