package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;

import java.util.List;

public interface EnrollmentService {

    EnrollmentDto getEnrollment(int enrollmentId);

    List<CourseDto> getMyEnrollments();

    EnrollmentDto createEnrollment(int courseId);
}
