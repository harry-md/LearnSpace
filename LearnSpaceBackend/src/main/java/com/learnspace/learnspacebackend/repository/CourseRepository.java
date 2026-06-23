package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepository
        extends JpaRepository<Course, Integer>,
                JpaSpecificationExecutor<Course>,
                CourseRepositoryCustom {
    boolean existsByIdAndTeacherId(int courseId, int teacherId);

    @Query("""
        SELECT c
        FROM Course c
        JOIN FETCH c.category
        JOIN FETCH c.teacher
        LEFT JOIN FETCH c.chapters ch
        LEFT JOIN FETCH ch.lessons
        WHERE c.id = :courseId
        """)
    Optional<Course> findWithDetailsByCourseId(@Param("courseId") int courseId);
}
