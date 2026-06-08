package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.LessonProgress;

import org.springframework.stereotype.Repository;

@Repository
public interface LessonProgressRepository {
    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByStudentAndLesson(int studentId, int lessonId);
}
