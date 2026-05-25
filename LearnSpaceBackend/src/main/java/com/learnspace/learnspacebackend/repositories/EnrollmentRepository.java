package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;

import java.util.List;

public interface EnrollmentRepository {

    boolean hasValidEnrollment(int studentId, int courseId);

    Enrollment getEnrollmentById(int id);
}
