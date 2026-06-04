package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;

public interface EnrollmentService {
    EnrollmentDto createEnrollment(int courseId);
}
