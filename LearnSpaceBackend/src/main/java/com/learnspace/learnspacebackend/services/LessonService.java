package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonListDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;

import java.util.List;

public interface LessonService {

    List<LessonListDto> getLessons(int chapterId);

    LessonDto getLesson(int lessonId);

    LessonDto createLesson(int chapterId, LessonDto lessonDto);

    LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto);

    void deleteLesson(int lessonId);
}
