package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    Long countByCourseIdAndStatusIn(int courseId, Collection<EnrollmentStatus> statuses);

    Optional<Enrollment> findByStudentIdAndCourseIdAndStatusIn(
            int studentId, int courseId, Collection<EnrollmentStatus> statuses);
}
