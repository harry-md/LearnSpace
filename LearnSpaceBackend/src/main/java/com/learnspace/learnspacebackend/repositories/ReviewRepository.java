package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Review;

import java.util.List;
import java.util.Map;

public interface ReviewRepository {

    Double getAverageRatingByCourseId(int courseId);

    List<Review> getReviewsByCourse(int courseId, Map<String, String> params);

    Long countReviewsByCourse(int courseId, Map<String, String> params);

    Review addOrUpdateReview(Review review);

    Review getReviewById(int reviewId);
}
