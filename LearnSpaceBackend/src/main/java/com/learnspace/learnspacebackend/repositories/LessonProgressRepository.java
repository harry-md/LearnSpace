package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

import java.util.Map;

public interface LessonProgressRepository {
    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByStudentAndLesson(int studentId, int lessonId);

    LessonProgress getLessonProgressByStudentAndCourse(int studentId, int courseId);

    Map<Integer, Long> countCompletedLessons(int studentId, java.util.List<Integer> courseIds);
}
