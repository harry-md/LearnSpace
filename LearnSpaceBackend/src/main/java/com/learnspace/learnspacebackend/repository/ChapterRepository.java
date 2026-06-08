package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Chapter;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
    boolean existsByIdAndCourseTeacherId(int chapterId, int teacherId);
}
