package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.ChapterDto;

import java.util.List;

public interface ChapterService {

    List<ChapterDto> getChapters(int courseId);

    ChapterDto getChapterById(int chapterId);

    ChapterDto createChapter(int courseId, ChapterDto chapterDto);

    ChapterDto updateChapter(int chapterId, ChapterDto chapterDto);

    void deleteChapter(int chapterId);
}
