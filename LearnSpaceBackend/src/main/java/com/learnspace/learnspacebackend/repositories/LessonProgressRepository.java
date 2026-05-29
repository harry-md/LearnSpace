package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressRepository {

    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);

    LessonProgress getLessonProgressByEnrollmentAndLesson(int enrollmentId, int lessonId);

    LessonProgress getLessonProgressByStudentAndCourse(int studentId, int courseId);
}
