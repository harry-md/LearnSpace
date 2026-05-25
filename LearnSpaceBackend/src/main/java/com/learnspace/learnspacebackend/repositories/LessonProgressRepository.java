package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressRepository {

    LessonProgress getLessonProgressById(int progressId);

    LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress);
}
