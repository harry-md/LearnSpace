package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;

import java.util.List;
import java.util.Map;

public interface EnrollmentRepository {
    boolean checkValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentById(int enrollmentId);

    Enrollment addOrUpdateEnrollment(Enrollment enrollment);

    Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... status);

    Long countEnrollments(int courseId);

    Map<Integer, Long> getEnrollmentCounts(List<Integer> courseIds);
}
