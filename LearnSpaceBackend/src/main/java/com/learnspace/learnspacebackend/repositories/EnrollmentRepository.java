package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Enrollment;

public interface EnrollmentRepository {

    boolean hasValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentById(int enrollmentId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    void deleteEnrollment(int enrollmentId);
}
