package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.review.ReviewDto;

import java.util.List;

public interface ReviewService {

    List<ReviewDto> getReviewsByCourse(int courseId);
}
