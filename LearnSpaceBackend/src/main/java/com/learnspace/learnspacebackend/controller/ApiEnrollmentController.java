package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.enrollment.EnrollmentDto;
import com.learnspace.learnspacebackend.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiEnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping("/courses/{courseId}/enrollments")
    public ResponseEntity<EnrollmentDto> create(@PathVariable("courseId") int courseId) {
        return new ResponseEntity<>(
                enrollmentService.createEnrollment(courseId), HttpStatus.CREATED);
    }
}
