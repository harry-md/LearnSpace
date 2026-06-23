package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.review.ReviewDto;
import com.learnspace.learnspacebackend.entity.Review;
import com.learnspace.learnspacebackend.mapper.ReviewMapper;
import com.learnspace.learnspacebackend.repository.ReviewRepository;
import com.learnspace.learnspacebackend.service.ReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Value("${review.page_size}")
    private int REVIEW_PAGE_SIZE;

    @Override
    public Page<ReviewDto> getReviewsByCourseId(int courseId, int page) {
        Pageable pageable = PageRequest.of(page - 1, REVIEW_PAGE_SIZE);
        Page<Review> reviewPage = reviewRepository.findByCourseId(courseId, pageable);
        return reviewPage.map(reviewMapper::toDto);
    }
}
