package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.review.ReviewDto;
import com.learnspace.learnspacebackend.service.ReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiReviewController {
    private final ReviewService reviewService;

    @GetMapping("/courses/{courseId}/reviews")
    public ResponseEntity<Page<ReviewDto>> list(
            @PathVariable("courseId") int courseId,
            @RequestParam(name = "page", defaultValue = "1") int page) {
        return ResponseEntity.ok(reviewService.getReviewsByCourseId(courseId, page));
    }
}
