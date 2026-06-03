package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Chapter;

import java.util.List;
import java.util.Map;

public interface ChapterRepository {
    Chapter getChapterById(int chapterId);

    Chapter createOrUpdate(Chapter chapter);

    void deleteChapter(int chapterId);

    Map<Integer, Long> countChapters(List<Integer> courseIds);

    List<Chapter> getChaptersByCourse(int ids);

    Integer getMaxOrder(int courseId);
}
