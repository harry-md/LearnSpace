import { authApis, endpoints } from "@/configs/Apis";
import { UserContext } from "@/configs/Context";
import { useContext, useState } from "react";

const useLessonProcess = () => {
  const [user] = useContext(UserContext);
  const [lessonProgress, setLessonProgress] = useState(null);

  const getLessonProgress = async (lessonId) => {
    try {
      const res = await authApis(user.token).get(
        endpoints.lesson_progress(lessonId),
      );
      if (res.status === 200) {
        console.log("GET progress success:", res.data);
        setLessonProgress(res.data);
      }
    } catch (err) {
      console.log("GET progress failed, creating new progress...", err);
      await createLessonProgress(lessonId);
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
      console.log(
        "POST create progress success:",
        res.data || { watchedSec: 0 },
      );
      setLessonProgress(res.data || { watchedSec: 0 });
    } catch (err) {
      console.log("POST create progress failed:", err);
    }
  };

  const updateLessonProgress = async (lessonId, sec) => {
    try {
      await authApis(user.token).patch(endpoints.lesson_progress(lessonId), {
        watchedSec: sec,
      });
      console.log("PATCH update progress success to", sec, "seconds");
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
