package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dto.review.ReviewDto;

import java.util.Map;

public interface ReviewService {
    PaginatedResponseDto<ReviewDto> getReviewsByCourse(int courseId, Map<String, String> params);
}
