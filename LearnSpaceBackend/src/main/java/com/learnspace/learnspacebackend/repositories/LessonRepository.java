package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Lesson;

import java.util.List;

public interface LessonRepository {
    Lesson addOrUpdateLesson(Lesson lesson);

    Lesson getLessonById(int lessonId);

    void deleteLesson(int lessonId);

    List<String> getVideoUrlsByChapterId(int chapterId);

    List<String> getVideoUrlsByCourseId(int courseId);
}
