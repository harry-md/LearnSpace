package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;

public interface EnrollmentRepository {
    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... status);

    Long countEnrollments(int courseId);
}
