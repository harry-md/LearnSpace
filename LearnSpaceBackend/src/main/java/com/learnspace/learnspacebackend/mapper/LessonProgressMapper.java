package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.entity.LessonProgress;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonProgressMapper {

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    LessonProgressDto toDto(LessonProgress lessonProgress);

    @Mapping(target = "completed", ignore = true)
    LessonProgress toEntity(LessonProgressDto dto);
}
