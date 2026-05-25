package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;
import com.learnspace.learnspacebackend.dtos.LessonPatchDto;
import com.learnspace.learnspacebackend.pojo.Lesson;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    LessonListDto toListDto(Lesson lesson);

    LessonDto toDto(Lesson lesson);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "video", ignore = true)
    @Mapping(target = "videoLength", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    Lesson toEntity(LessonDto dto);

    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "video", ignore = true)
    @Mapping(target = "videoLength", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(@MappingTarget Lesson lesson, LessonPatchDto dto);
}
