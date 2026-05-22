package com.learnspace.learnspacebackend.repositories;

public interface EnrollmentRepository {

    boolean hasValidEnrollment(int studentId, int courseId);
}
