package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... status);
}
