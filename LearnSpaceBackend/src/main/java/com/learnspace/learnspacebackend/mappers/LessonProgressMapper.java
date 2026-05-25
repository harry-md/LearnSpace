package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.LessonProgressDto;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonProgressMapper {
    @Mapping(target = "lessonName", source = "lesson.title")
    LessonProgressDto toDto(LessonProgress lessonProgress);

    LessonProgress toEntity(LessonProgressDto dto);
}
