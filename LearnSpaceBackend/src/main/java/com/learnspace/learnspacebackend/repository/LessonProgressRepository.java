package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.LessonProgress;

public interface LessonProgressRepository {
    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByStudentAndLesson(int studentId, int lessonId);
}
