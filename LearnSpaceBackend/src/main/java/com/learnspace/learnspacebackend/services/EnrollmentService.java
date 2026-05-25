package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.EnrollmentDto;

public interface EnrollmentService {
    EnrollmentDto getEnrollment(int enrollmentId);
}
