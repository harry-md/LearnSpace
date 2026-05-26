package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.EnrollmentDto;
import com.learnspace.learnspacebackend.services.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiEnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<EnrollmentDto> retrive(@PathVariable("enrollmentId") int id) {
        return ResponseEntity.ok(enrollmentService.getEnrollment(id));
    }

    @GetMapping("/enrollments/my-courses")
    public ResponseEntity<List<EnrollmentDto>> getMyEnrollments() {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments());
    }
}
