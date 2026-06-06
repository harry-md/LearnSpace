package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.enrollment.EnrollmentDto;

public interface EnrollmentService {
    EnrollmentDto createEnrollment(int courseId);
}
