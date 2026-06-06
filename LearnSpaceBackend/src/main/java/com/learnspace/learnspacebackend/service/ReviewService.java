package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.review.ReviewDto;

import org.springframework.data.domain.Page;

public interface ReviewService {
    Page<ReviewDto> getReviewsByCourseId(int courseId, int page);
}
