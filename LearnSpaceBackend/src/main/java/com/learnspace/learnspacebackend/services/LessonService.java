package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;

public interface LessonService {
    LessonDto getLesson(int lessonId);

    LessonDto createLesson(int chapterId, LessonDto lessonDto);

    LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto);

    void deleteLesson(int lessonId);
}
