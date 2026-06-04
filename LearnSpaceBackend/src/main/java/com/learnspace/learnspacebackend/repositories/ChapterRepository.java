package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Chapter;

public interface ChapterRepository {
    Chapter getChapterById(int chapterId);

    Chapter createOrUpdate(Chapter chapter);

    void deleteChapter(int chapterId);
}
