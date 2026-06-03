package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;

import java.math.BigDecimal;

public interface EnrollmentService {
    EnrollmentDto getEnrollment(int enrollmentId);

    EnrollmentDto createEnrollment(int courseId);
}
