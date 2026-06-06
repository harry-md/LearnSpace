package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dto.review.ReviewDto;
import com.learnspace.learnspacebackend.mapper.PaginatedResponseMapper;
import com.learnspace.learnspacebackend.mapper.ReviewMapper;
import com.learnspace.learnspacebackend.repository.ReviewRepository;
import com.learnspace.learnspacebackend.service.ReviewService;

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
                reviewRepository.countReviewsByCourse(courseId),
                Integer.parseInt(params.getOrDefault("page", "1")),
                REVIEW_PAGE_SIZE,
                results);
    }
}
