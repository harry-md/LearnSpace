package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dto.chapter.ChapterPatchDto;

public interface ChapterService {
    ChapterDto createChapter(int courseId, ChapterDto chapterDto);

    ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto);

    void deleteChapter(int chapterId);
}
