package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.dtos.ChapterPatchDto;

import java.util.List;

public interface ChapterService {

    List<ChapterDto> getChapters(int courseId);

    ChapterDto getChapter(int chapterId);

    ChapterDto createChapter(int courseId, ChapterDto chapterDto);

    ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto);

    void deleteChapter(int chapterId);
}
