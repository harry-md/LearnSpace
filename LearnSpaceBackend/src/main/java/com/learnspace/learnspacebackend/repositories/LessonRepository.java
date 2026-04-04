package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Lesson;

import java.util.List;

public interface LessonRepository {
    List<Lesson> getLessons(int chapterId);
}
