package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;

public interface EnrollmentRepository {

    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentById(int enrollmentId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    void deleteEnrollment(int enrollmentId);

    Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... statuses);

    Long countEnrollmentsByCourse(int courseId);
}
