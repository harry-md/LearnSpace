package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.mappers.ChapterMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.services.ChapterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterServiceImpl implements ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterMapper chapterMapper;

    @Override
    public List<ChapterDto> getChapters(int courseId) {
        return chapterRepository.getChaptersByCourse(courseId).stream()
                .map(chapterMapper::toDto)
                .toList();
    }

    @Override
    public ChapterDto getChapterById(int chapterId) {
        return chapterMapper.toDto(chapterRepository.getChapterById(chapterId));
    }

    @Override
    public ChapterDto createOrUpdate(int courseId, ChapterDto chapterdto) {
        Chapter chapter = chapterMapper.toEntity(chapterdto);
        return chapterMapper.toDto(chapterRepository.createOrUpdate(courseId, chapter));
    }

    @Override
    public void deleteChapter(int chapterId) {
        chapterRepository.deleteChapter(chapterId);
    }
}
