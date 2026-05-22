import { useState, useEffect } from "react";
import Apis, { authApis, endpoints } from "@/configs/Apis";
import { toast } from "@heroui/react";

export const useTeacherCourses = ({
  user,
  selectedCourse,
  setSelectedCourse,
  setCourses,
  setModal,
}) => {
  const [categories, setCategories] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await Apis.get(endpoints.categories);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi fetch categories:", err);
    }
  };

  const loadCourse = async () => {
    if (!user || !user.id) return;
    try {
      const res = await authApis(user.token).get(
        `${endpoints.courses}?teacherId=${user.id}`,
      );
      const rawCourses = res.data;

      const mappedCourses = rawCourses.map((course) => ({
        ...course,
        title: course.name || "Không có tên",
        image:
          course.image ||
          `https://placehold.co/320x180/5624d0/ffffff?text=${encodeURIComponent((course.name || "Course").slice(0, 10))}`,
        sections: [],
      }));

      setCourses(mappedCourses);
      setSelectedCourse((prev) => {
        if (!prev) return null;
        return mappedCourses.find((c) => c.id === prev.id) || prev;
      });
    } catch (err) {
      console.error("Lỗi khi fetch danh sách khóa học:", err);
    }
  };

  const handleDeleteCourse = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?"))
      return;

    const deletePromise = async () => {
      await authApis(user.token).delete(`${endpoints.courses}/${id}`);
      await loadCourse();
    };

    toast.promise(deletePromise(), {
      loading: "Đang xóa khóa học...",
      success: "Xóa khóa học thành công!",
      error: (err) => {
        console.error("Lỗi khi xóa khóa học:", err);
        return `Xóa khóa học thất bại: ${err.response?.data?.message || err.message}`;
      },
    });
  };

  const togglePublish = (id) =>
    setCourses((p) =>
      p.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );

  const openEditCourse = (course) => {
    setEditingCourseId(course.id);
    setModal("edit-course");
  };

  const onSuccessCreateCourse = (newCourse) => {
    setCourses((p) => [newCourse, ...p]);
  };

  const onSuccessEditCourse = (updatedCourse) => {
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse((prev) => ({
        ...prev,
        ...updatedCourse,
        title: updatedCourse.name || "Không có tên",
        image: updatedCourse.image || prev.image,
      }));
    }
    loadCourse();
  };

  useEffect(() => {
    loadCategories();
    loadCourse();
  }, [user]);

  return {
    categories,
    editingCourseId,
    loadCourse,
    loadCategories,
    handleDeleteCourse,
    togglePublish,
    openEditCourse,
    onSuccessCreateCourse,
    onSuccessEditCourse,
  };
};
