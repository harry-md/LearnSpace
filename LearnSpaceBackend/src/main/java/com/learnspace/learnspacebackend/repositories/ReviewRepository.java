package com.learnspace.learnspacebackend.repositories;

public interface ReviewRepository {

    Double getAverageRatingByCourseId(int courseId);
}
