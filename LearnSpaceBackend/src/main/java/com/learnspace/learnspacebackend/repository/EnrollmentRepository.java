package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;

public interface EnrollmentRepository {
    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... status);

    Long countEnrollments(int courseId);
}
