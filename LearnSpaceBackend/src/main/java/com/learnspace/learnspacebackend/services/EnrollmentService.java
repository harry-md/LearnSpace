package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.EnrollmentDto;

import java.util.List;

public interface EnrollmentService {

    EnrollmentDto getEnrollment(int enrollmentId);

    List<EnrollmentDto> getMyEnrollments();
    EnrollmentDto createEnrollment(int courseId);
}
