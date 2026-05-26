package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Enrollment;

public interface EnrollmentRepository {

    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentById(int enrollmentId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    void deleteEnrollment(int enrollmentId);

    Enrollment getEnrollmentByStudentAndCourse(int studentId, int courseId);

    List<Enrollment> getEnrollmentsByStudentId(int studentId);
}
