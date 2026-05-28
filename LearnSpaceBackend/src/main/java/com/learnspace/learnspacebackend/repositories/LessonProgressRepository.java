package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

import java.util.List;

public interface LessonProgressRepository {

    LessonProgress getLessonProgressByLessonAndStudent(int lessonId, int student);

    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByEnrollmentAndLesson(int enrollmentId, int lessonId);

    int countCompletedLessonsByEnrollment(int enrollmentId);

    List<LessonProgress> getLessonProgressByEnrollment(int enrollmentId);
}
