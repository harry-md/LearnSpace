package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;
import com.learnspace.learnspacebackend.services.EnrollmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiEnrollmentController {
    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/courses/{courseId}/enrollments")
    public ResponseEntity<EnrollmentDto> create(@PathVariable("courseId") int courseId) {
        return new ResponseEntity<>(
                enrollmentService.createEnrollment(courseId), HttpStatus.CREATED);
    }
}
