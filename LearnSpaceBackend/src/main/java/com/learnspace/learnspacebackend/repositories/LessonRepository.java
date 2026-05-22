package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Lesson;

import java.util.List;

public interface LessonRepository {

    List<Lesson> getLessons(int chapterId);

    Lesson addOrUpdateLesson(Lesson lesson);

    Lesson getLessonById(int lessonId);

    void deleteLesson(int lessonId);
}
