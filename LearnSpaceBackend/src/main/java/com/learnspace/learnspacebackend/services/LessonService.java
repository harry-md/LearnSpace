package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonDto;

import java.util.List;

public interface LessonService {
    List<LessonDto> getLessons(int chapterId);
}
