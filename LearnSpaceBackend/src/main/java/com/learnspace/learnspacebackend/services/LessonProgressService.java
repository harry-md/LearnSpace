package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;

public interface LessonProgressService {
    LessonProgressDto saveLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);
    LessonProgressDto getLessonProgress(int lessonId);
}
