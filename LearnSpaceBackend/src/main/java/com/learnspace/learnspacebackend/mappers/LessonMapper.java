package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonListDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.pojo.Lesson;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    LessonListDto toListDto(Lesson lesson);

    @Mapping(target = "videoFile", ignore = true)
    LessonDto toDto(Lesson lesson);

    @Mapping(target = "videoFile", ignore = true)
    @Mapping(source = "progressDto", target = "progress")
    @Mapping(source = "lesson.createdAt", target = "createdAt")
    @Mapping(source = "lesson.updatedAt", target = "updatedAt")
    LessonDto toDtoWithProgress(Lesson lesson, LessonProgressDto progressDto);

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
