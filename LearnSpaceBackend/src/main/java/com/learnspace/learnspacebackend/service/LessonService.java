package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.lesson.LessonDto;
import com.learnspace.learnspacebackend.dto.lesson.LessonPatchDto;

public interface LessonService {
    LessonDto getLesson(int lessonId);

    LessonDto createLesson(int chapterId, LessonDto lessonDto);

    LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto);

    void deleteLesson(int lessonId);
}
