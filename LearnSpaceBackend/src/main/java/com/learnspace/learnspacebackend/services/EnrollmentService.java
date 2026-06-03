package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;

public interface EnrollmentService {
    EnrollmentDto getEnrollment(int enrollmentId);

    EnrollmentDto createEnrollment(int courseId);
}
