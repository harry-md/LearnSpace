package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.LessonProgress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Integer> {
    boolean existsByLessonIdAndStudentId(int lessonId, int studentId);

    Optional<LessonProgress> findByLessonIdAndStudentId(int lessonId, int studentId);
}
