package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Review;

import java.util.List;

public interface ReviewRepository {

    Double getAverageRatingByCourseId(int courseId);

    List<Review> getReviewsByCourse(int courseId);
}
