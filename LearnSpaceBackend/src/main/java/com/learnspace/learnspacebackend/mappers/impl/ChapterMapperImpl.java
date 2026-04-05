package com.learnspace.learnspacebackend.mappers.impl;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.mappers.ChapterMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;

import org.springframework.stereotype.Component;

@Component
public class ChapterMapperImpl implements ChapterMapper {
    @Override
    public ChapterDto toDto(Chapter c) {
        return new ChapterDto(c.getId(), c.getName(), c.getOrder(), c.getFree());
    }

    @Override
    public Chapter toEntity(ChapterDto dto) {
        Chapter c = new Chapter();
        c.setId(dto.id());
        c.setName(dto.name());
        c.setFree(dto.free());
        c.setOrder(dto.order());
        return c;
    }
}
