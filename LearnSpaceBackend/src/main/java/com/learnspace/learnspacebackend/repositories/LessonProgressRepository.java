package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressRepository {
    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByStudentAndLesson(int studentId, int lessonId);

    LessonProgress getLessonProgressByStudentAndCourse(int studentId, int courseId);
}
