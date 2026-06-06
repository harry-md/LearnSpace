package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Chapter;

public interface ChapterRepository {
    Chapter getChapterById(int chapterId);

    Chapter createOrUpdate(Chapter chapter);

    void deleteChapter(int chapterId);
}
