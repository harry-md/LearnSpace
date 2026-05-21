package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface LessonService {

    List<LessonListDto> getLessons(int chapterId);

    LessonDto getLesson(int lessonId);

    LessonDto addOrUpdateLesson(int chapterId, Map<String, String> lesson, MultipartFile video);
}
