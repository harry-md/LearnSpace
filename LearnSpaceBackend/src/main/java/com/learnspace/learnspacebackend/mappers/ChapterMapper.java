package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dtos.chapter.ChapterPatchDto;
import com.learnspace.learnspacebackend.pojo.Chapter;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        uses = {LessonMapper.class})
public interface ChapterMapper {

    @Mapping(target = "lessons", source = "lessons")
    ChapterDto toDto(Chapter c);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    Chapter toEntity(ChapterDto dto);

    @Mapping(target = "course", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(@MappingTarget Chapter chapter, ChapterPatchDto dto);
}
