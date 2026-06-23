package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.progress.LessonProgressDto;

public interface LessonProgressService {
    LessonProgressDto saveLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);
}
