package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dtos.review.ReviewDto;

import java.util.Map;

public interface ReviewService {
    PaginatedResponseDto<ReviewDto> getReviewsByCourse(int courseId, Map<String, String> params);
}
