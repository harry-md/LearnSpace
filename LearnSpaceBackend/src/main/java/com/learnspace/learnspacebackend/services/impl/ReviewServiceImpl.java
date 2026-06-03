package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dtos.review.ReviewDto;
import com.learnspace.learnspacebackend.mappers.PaginatedResponseMapper;
import com.learnspace.learnspacebackend.mappers.ReviewMapper;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Value("${review.page_size}")
    private int REVIEW_PAGE_SIZE;

    @Autowired
    private ReviewMapper reviewMapper;

    @Override
    public PaginatedResponseDto<ReviewDto> getReviewsByCourse(
            int courseId, Map<String, String> params) {

        List<ReviewDto> results = reviewRepository.getReviewsByCourse(courseId, params).stream()
                .map(reviewMapper::toDto)
                .toList();

        return PaginatedResponseMapper.toPaginatedResponseDto(
                reviewRepository.countReviewsByCourse(courseId, params),
                Integer.parseInt(params.get("page")),
                REVIEW_PAGE_SIZE,
                results);
    }
}
