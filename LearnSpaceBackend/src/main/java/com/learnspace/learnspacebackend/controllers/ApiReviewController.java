package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.review.ReviewDto;
import com.learnspace.learnspacebackend.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/courses/{courseId}/reviews")
    public ResponseEntity<List<ReviewDto>> list(@PathVariable("courseId") int courseId) {
        return ResponseEntity.ok(reviewService.getReviewsByCourse(courseId));
    }
}
