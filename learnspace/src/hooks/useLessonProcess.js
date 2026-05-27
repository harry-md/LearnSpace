import { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";
import { useContext, useState } from "react";

const useLessonProcess = () => {
  const [user] = useContext(UserContext);
  const [lessonProgress, setLessonProgress] = useState(null);

  const getLessonProgress = async (lessonId) => {
    setLessonProgress(null);
    try {
      const res = await authApis(user.token).get(
        endpoints.lesson_progress(lessonId),
      );
      if (res.status === 200) {
        setLessonProgress(res.data);
        return res.data;
      }
    } catch (err) {
      return await createLessonProgress(lessonId);
    }
  };

  const createLessonProgress = async (lessonId) => {
    try {
      const res = await authApis(user.token).post(
        endpoints.lesson_progress(lessonId),
        {
          watchedSec: 0,
        },
      );
      const data = res.data || { watchedSec: 0 };
      setLessonProgress(data);
      return data;
    } catch (err) {
      console.log("POST create progress failed:", err);
      return null;
    }
  };

  const updateLessonProgress = async (lessonId, sec) => {
    try {
      await authApis(user.token).patch(endpoints.lesson_progress(lessonId), {
        watchedSec: sec,
      });
      setLessonProgress((prev) =>
        prev ? { ...prev, watchedSec: sec } : { watchedSec: sec },
      );
    } catch (err) {
      console.log("PATCH update progress failed:", err);
    }
  };
  return { lessonProgress, getLessonProgress, updateLessonProgress };
};

export default useLessonProcess;
