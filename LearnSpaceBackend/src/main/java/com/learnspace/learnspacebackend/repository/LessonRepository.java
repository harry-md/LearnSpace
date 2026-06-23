package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    boolean existsByIdAndChapterCourseTeacherId(int lessonId, int teacherId);

    @Query("""
        SELECT l
        FROM Lesson l
        JOIN FETCH l.chapter ch
        JOIN FETCH ch.course co
        WHERE l.id = :lessonId
        """)
    Optional<Lesson> findWithChapterAndCourseById(@Param("lessonId") int lessonId);

    @Query("""
        SELECT l.video
        FROM Lesson l
        WHERE l.chapter.id = :chapterId
        """)
    List<String> getVideoUrlsByChapterId(@Param("chapterId") int chapterId);

    @Query("""
        SELECT l.video
        FROM Lesson l
        JOIN l.chapter ch
        WHERE ch.course.id = :courseId
        """)
    List<String> getVideoUrlsByCourseId(@Param("courseId") int courseId);
}
