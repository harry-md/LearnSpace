package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Chapter;

import java.util.List;

public interface ChapterRepositiry {
    List<Chapter> getChaptersByCourse(int courseId);

    Chapter getChapterById(int ChapterId);
}
