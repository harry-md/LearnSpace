package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Lesson;

import java.util.List;
import java.util.Map;

public interface LessonRepository {
    List<Lesson> getLessons(int chapterId);

    Lesson addOrUpdateLesson(Lesson lesson);

    Lesson getLessonById(int lessonId);

    void deleteLesson(int lessonId);

    Map<Integer, Long> countLessons(List<Integer> courseIds);

    List<String> getVideoUrlsByChapterId(int chapterId);

    List<String> getVideoUrlsByCourseId(int courseId);
}
