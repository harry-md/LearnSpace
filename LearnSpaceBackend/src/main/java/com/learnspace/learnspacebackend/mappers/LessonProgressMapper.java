package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.LessonProgressDto;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonProgressMapper {
    LessonProgressDto toDto(LessonProgress lessonProgress);

    @Mapping(target = "completed", ignore = true)
    LessonProgress toEntity(LessonProgressDto dto);
}
