package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressRepository {

    LessonProgress getLessonProgressByLessonAndStudent(int lessonId, int student);

    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByEnrollmentAndLesson(int enrollmentId, int lessonId);

    int countCompletedLessonsByEnrollment(int enrollmentId);
}
