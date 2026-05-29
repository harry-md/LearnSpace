package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Chapter;

import java.util.List;

public interface ChapterRepository {

    Chapter getChapterById(int chapterId);

    boolean existChapter(int chapterId);

    Chapter createOrUpdate(Chapter chapter);

    void deleteChapter(int chapterId);

    List<Chapter> getChaptersByCourse(int courseId);

    Integer getMaxOrder(int courseId);
}
