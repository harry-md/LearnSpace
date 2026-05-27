package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressRepository {

    LessonProgress getLessonProgressByLesson(int lessonId);

    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByEnrollmentAndLesson(int enrollmentId, int lessonId);

    int countCompletedLessonsByStudentAndCourse(int studentId, int courseId);
}
