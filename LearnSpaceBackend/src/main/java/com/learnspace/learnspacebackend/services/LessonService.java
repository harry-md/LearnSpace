package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonDto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface LessonService {

    List<LessonDto> getLessons(int chapterId);

    LessonDto addOrUpdateLesson(int chapterId, Map<String, String> lesson, MultipartFile video);
}
