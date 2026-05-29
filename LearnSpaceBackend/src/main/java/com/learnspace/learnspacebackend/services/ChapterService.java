package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dtos.chapter.ChapterPatchDto;

public interface ChapterService {

    ChapterDto createChapter(int courseId, ChapterDto chapterDto);

    ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto);

    void deleteChapter(int chapterId);
}
