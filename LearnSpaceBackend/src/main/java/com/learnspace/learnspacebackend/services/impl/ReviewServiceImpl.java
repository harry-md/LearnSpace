package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.review.ReviewDto;
import com.learnspace.learnspacebackend.mappers.ReviewMapper;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewMapper reviewMapper;

    @Override
    public List<ReviewDto> getReviewsByCourse(int courseId) {
        return reviewRepository.getReviewsByCourse(courseId).stream()
                .map(reviewMapper::toDto)
                .toList();
    }
}
