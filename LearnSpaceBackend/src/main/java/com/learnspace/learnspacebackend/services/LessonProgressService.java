package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;

public interface LessonProgressService {
    LessonProgressDto addLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);

    LessonProgressDto updateLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);
}
