package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId")
    Double getAverageRatingByCourseId(@Param("courseId") int courseId);

    @EntityGraph(attributePaths = "student")
    Page<Review> findByCourseId(@Param("courseId") int courseId, Pageable pageable);
}
