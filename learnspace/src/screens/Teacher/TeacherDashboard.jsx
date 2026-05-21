import React, { useState } from "react";
import { INITIAL_COURSES, totalLessons, newId } from "../../data/TeacherData";

import Sidebar from "../../components/Teacher/Dashboard/Sidebar";
import Header from "../../components/Teacher/Dashboard/Header";
import OverviewTab from "../../components/Teacher/Dashboard/OverviewTab";
import CoursesTab from "../../components/Teacher/Dashboard/CoursesTab";
import ManageCourseTab from "../../components/Teacher/Dashboard/ManageCourseTab";
import DashboardModals from "../../components/Teacher/Dashboard/DashboardModals";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [view, setView] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [modal, setModal] = useState(null);

  // States dành cho Modals
  const [chapterTab, setChapterTab] = useState("new");
  const [lessonTargetSectionId, setLessonTargetSectionId] = useState(null);
  const [chapterTargetCourseId, setChapterTargetCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "Phát triển",
    level: "Cơ bản",
    price: "",
  });
  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
  });
  const [selectedExistingSection, setSelectedExistingSection] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video",
    duration: "",
    isFree: false,
  });

  // Drag and Drop States
  const [draggedSectionIdx, setDraggedSectionIdx] = useState(null);
  const [draggedLessonInfo, setDraggedLessonInfo] = useState(null);

  // Computed data
  const totalStudents = courses.reduce((a, c) => a + c.studentsCount, 0);
  const totalSections = courses.reduce((a, c) => a + c.sections.length, 0);
  const totalLessonsAll = courses.reduce(
    (a, c) => a + totalLessons(c.sections),
    0,
  );
  const allSections = courses.flatMap((c) =>
    c.sections.map((s) => ({ ...s, courseName: c.title, courseId: c.id })),
  );

  // === Handlers ===
  const handleCreateCourse = () => {
    if (!courseForm.title.trim()) return;
    const nc = {
      id: newId(),
      ...courseForm,
      image: `https://placehold.co/320x180/5624d0/ffffff?text=${encodeURIComponent(courseForm.title.slice(0, 10))}`,
      status: "draft",
      studentsCount: 0,
      rating: 0,
      revenue: "0 ₫",
      sections: [],
    };
    setCourses((p) => [nc, ...p]);
    setModal(null);
    setCourseForm({
      title: "",
      description: "",
      category: "Phát triển",
      level: "Cơ bản",
      price: "",
    });
  };

  const handleDeleteCourse = (id) =>
    setCourses((p) => p.filter((c) => c.id !== id));

  const togglePublish = (id) =>
    setCourses((p) =>
      p.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "published" ? "draft" : "published" }
          : c,
      ),
    );

  const openAddChapter = (courseId) => {
    setChapterTargetCourseId(courseId);
    setChapterForm({ title: "", description: "" });
    setSelectedExistingSection(null);
    setChapterTab("new");
    setModal("add-chapter");
  };

  const handleAddChapter = () => {
    if (chapterTab === "new") {
      if (!chapterForm.title.trim()) return;
      const ns = {
        id: newId(),
        title: chapterForm.title,
        description: chapterForm.description,
        lessons: [],
      };
      setCourses((p) =>
        p.map((c) =>
          c.id === chapterTargetCourseId
            ? { ...c, sections: [...c.sections, ns] }
            : c,
        ),
      );
      if (selectedCourse?.id === chapterTargetCourseId)
        setSelectedCourse((p) => ({ ...p, sections: [...p.sections, ns] }));
    } else {
      if (!selectedExistingSection) return;
      const cl = {
        ...selectedExistingSection,
        id: newId(),
        lessons: selectedExistingSection.lessons.map((l) => ({
          ...l,
          id: newId(),
        })),
      };
      setCourses((p) =>
        p.map((c) =>
          c.id === chapterTargetCourseId
            ? { ...c, sections: [...c.sections, cl] }
            : c,
        ),
      );
      if (selectedCourse?.id === chapterTargetCourseId)
        setSelectedCourse((p) => ({ ...p, sections: [...p.sections, cl] }));
    }
    setModal(null);
  };

  const handleDeleteSection = (courseId, sectionId) => {
    setCourses((p) =>
      p.map((c) =>
        c.id === courseId
          ? { ...c, sections: c.sections.filter((s) => s.id !== sectionId) }
          : c,
      ),
    );
    if (selectedCourse?.id === courseId)
      setSelectedCourse((p) => ({
        ...p,
        sections: p.sections.filter((s) => s.id !== sectionId),
      }));
  };

  const openAddLesson = (sectionId) => {
    setLessonTargetSectionId(sectionId);
    setLessonForm({ title: "", type: "video", duration: "", isFree: false });
    setModal("add-lesson");
  };

  const handleAddLesson = () => {
    if (!lessonForm.title.trim()) return;
    const nl = { id: newId(), ...lessonForm };
    const up = (c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === lessonTargetSectionId
          ? { ...s, lessons: [...s.lessons, nl] }
          : s,
      ),
    });
    setCourses((p) =>
      p.map((c) =>
        c.sections.some((s) => s.id === lessonTargetSectionId) ? up(c) : c,
      ),
    );
    if (selectedCourse?.sections.some((s) => s.id === lessonTargetSectionId))
      setSelectedCourse((p) => up(p));
    setModal(null);
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    const up = (c) => ({
      ...c,
      sections: c.sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s,
      ),
    });
    setCourses((p) =>
      p.map((c) => (c.sections.some((s) => s.id === sectionId) ? up(c) : c)),
    );
    if (selectedCourse) setSelectedCourse((p) => up(p));
  };

  const openManage = (course) => {
    setSelectedCourse(course);
    setOpenSections({});
    setView("manage");
  };
  const toggleSection = (id) =>
    setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  // ─────────────────────────────────────────────────────────────────
  // BỔ SUNG LOGIC DRAG AND DROP BỊ THIẾU Ở ĐÂY
  // ─────────────────────────────────────────────────────────────────

  const updateReorderedSections = (newSections) => {
    setSelectedCourse((p) => ({ ...p, sections: newSections }));
    setCourses((p) =>
      p.map((c) =>
        c.id === selectedCourse.id ? { ...c, sections: newSections } : c,
      ),
    );
  };

  const handleSectionDragStart = (e, index) => {
    setDraggedSectionIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSectionDragOver = (e) => e.preventDefault();

  const handleSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedLessonInfo) {
      // Kéo bài học thả thẳng vào tên chương
      handleLessonDrop(e, selectedCourse.sections[targetIndex].id, undefined);
      return;
    }
    if (draggedSectionIdx === null || draggedSectionIdx === targetIndex) return;

    const newSections = [...selectedCourse.sections];
    const [draggedItem] = newSections.splice(draggedSectionIdx, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    updateReorderedSections(newSections);
    setDraggedSectionIdx(null);
  };

  const handleLessonDragStart = (e, sectionId, lessonIdx) => {
    e.stopPropagation();
    setDraggedLessonInfo({ sectionId, lessonIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleLessonDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleLessonDrop = (e, targetSectionId, targetLessonIdx) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedLessonInfo) return;

    const { sectionId: sourceSId, lessonIdx: sourceLIdx } = draggedLessonInfo;
    const newSections = selectedCourse.sections.map((s) => ({
      ...s,
      lessons: [...s.lessons],
    }));

    const sourceSection = newSections.find((s) => s.id === sourceSId);
    const targetSection = newSections.find((s) => s.id === targetSectionId);

    if (!sourceSection || !targetSection) return;

    const [draggedLesson] = sourceSection.lessons.splice(sourceLIdx, 1);

    if (targetLessonIdx === undefined) {
      targetSection.lessons.push(draggedLesson);
    } else {
      targetSection.lessons.splice(targetLessonIdx, 0, draggedLesson);
    }

    updateReorderedSections(newSections);
    setDraggedLessonInfo(null);
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Inter', sans-serif",
        background: "#f7f9fa",
        color: "#1c1d1f",
      }}
    >
      <Sidebar view={view} setView={setView} />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          view={view}
          setView={setView}
          selectedCourse={selectedCourse}
          setModal={setModal}
          openAddChapter={openAddChapter}
        />

        {view === "overview" && (
          <OverviewTab
            courses={courses}
            totalStudents={totalStudents}
            totalSections={totalSections}
            totalLessonsAll={totalLessonsAll}
            openManage={openManage}
          />
        )}

        {view === "courses" && (
          <CoursesTab
            courses={courses}
            setModal={setModal}
            togglePublish={togglePublish}
            openManage={openManage}
            handleDeleteCourse={handleDeleteCourse}
          />
        )}

        {view === "manage" && selectedCourse && (
          <ManageCourseTab
            selectedCourse={selectedCourse}
            openSections={openSections}
            toggleSection={toggleSection}
            openAddLesson={openAddLesson}
            handleDeleteSection={handleDeleteSection}
            handleDeleteLesson={handleDeleteLesson}
            // Các props này giờ đã được định nghĩa ở trên
            draggedSectionIdx={draggedSectionIdx}
            handleSectionDragStart={handleSectionDragStart}
            handleSectionDragOver={handleSectionDragOver}
            handleSectionDrop={handleSectionDrop}
            draggedLessonInfo={draggedLessonInfo}
            handleLessonDragStart={handleLessonDragStart}
            handleLessonDragOver={handleLessonDragOver}
            handleLessonDrop={handleLessonDrop}
          />
        )}
      </div>

      <DashboardModals
        // ... (Giữ nguyên các props của Modal)
        modal={modal}
        setModal={setModal}
        courseForm={courseForm}
        setCourseForm={setCourseForm}
        handleCreateCourse={handleCreateCourse}
        chapterTab={chapterTab}
        setChapterTab={setChapterTab}
        chapterForm={chapterForm}
        setChapterForm={setChapterForm}
        handleAddChapter={handleAddChapter}
        allSections={allSections}
        chapterTargetCourseId={chapterTargetCourseId}
        selectedExistingSection={selectedExistingSection}
        setSelectedExistingSection={setSelectedExistingSection}
        lessonForm={lessonForm}
        setLessonForm={setLessonForm}
        handleAddLesson={handleAddLesson}
      />
    </div>
  );
};

export default TeacherDashboard;
