package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.EnrollmentDto;
import com.learnspace.learnspacebackend.pojo.Enrollment;

public interface EnrollmentService {
    EnrollmentDto getEnrollment(int enrollmentId);
}
