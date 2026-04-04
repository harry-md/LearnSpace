package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.mappers.ChapterMapper;
import com.learnspace.learnspacebackend.repositories.ChapterRepositiry;
import com.learnspace.learnspacebackend.services.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterServiceImpl implements ChapterService {

    @Autowired
    private ChapterRepositiry chapterRepositiry;

    @Autowired
    private ChapterMapper chapterMapper;

    @Override
    public List<ChapterDto> getChapters(int courseId) {
        return chapterRepositiry.getChaptersByCourse(courseId).stream()
                .map(chapterMapper::toDto)
                .toList();
    }

    @Override
    public ChapterDto getChapterById(int chapterId) {
        return chapterMapper.toDto(chapterRepositiry.getChapterById(chapterId));
    }
}
