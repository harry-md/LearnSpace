package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.pojo.Chapter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChapterMapper {

    ChapterDto toDto(Chapter c);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Chapter toEntity(ChapterDto dto);
}
