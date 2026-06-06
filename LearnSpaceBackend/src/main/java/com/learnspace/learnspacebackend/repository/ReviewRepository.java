package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Review;

import java.util.List;
import java.util.Map;

public interface ReviewRepository {
    Double getAverageRatingByCourse(int courseId);

    List<Review> getReviewsByCourse(int courseId, Map<String, String> params);

    Long countReviewsByCourse(int courseId);
}
