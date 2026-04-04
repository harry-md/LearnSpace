package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.pojo.Chapter;

public interface ChapterMapper {
    ChapterDto toDto(Chapter c);

    Chapter toEntity(ChapterDto dto);
}
