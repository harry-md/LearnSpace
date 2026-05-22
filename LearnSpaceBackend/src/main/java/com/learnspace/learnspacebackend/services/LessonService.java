package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;
import com.learnspace.learnspacebackend.dtos.LessonPatchDto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface LessonService {

    List<LessonListDto> getLessons(int chapterId);

    LessonDto getLesson(int lessonId);

    LessonDto createLesson(int chapterId, LessonDto lessonDto, MultipartFile video);

    LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto, MultipartFile video);

    void deleteLesson(int lessonId);
}
