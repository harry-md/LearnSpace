package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dtos.review.ReviewDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.PaginatedResponseMapper;
import com.learnspace.learnspacebackend.mappers.ReviewMapper;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Review;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public PaginatedResponseDto<ReviewDto> getReviewsByCourse(
            int courseId, Map<String, String> params) {

        List<ReviewDto> results = reviewRepository.getReviewsByCourse(courseId, params).stream()
                .map(reviewMapper::toDto)
                .toList();

        return PaginatedResponseMapper.toPaginatedResponseDto(
                reviewRepository.countReviewsByCourse(courseId, params),
                Integer.parseInt(params.getOrDefault("page", "1")),
                REVIEW_PAGE_SIZE,
                results);
    }

    private User getLoggedInStudent() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.getUserById(principal.getId());
    }

    private boolean checkReviewOwner(Review review, User student) {
        return review.getStudent().getId().equals(student.getId());
    }

    @Override
    public ReviewDto addReview(int courseId, ReviewDto reviewDto) {
        Course course = courseRepository.getCourseById(courseId);
        User user = userRepository.getUserById(getLoggedInStudent().getId());

        Review review = reviewMapper.toEntity(reviewDto);
        review.setCourse(course);
        review.setStudent(user);

        reviewRepository.addOrUpdateReview(review);
        return reviewMapper.toDto(review);
    }

    @Override
    public ReviewDto updateReview(int reviewId, ReviewDto reviewDto) {
        User currentUser = userRepository.getUserById(getLoggedInStudent().getId());
        Review review = reviewRepository.getReviewById(reviewId);
        if (!checkReviewOwner(review, currentUser))
            throw new AccessDeniedException("Bạn không có quyền sửa");
        return null;
    }

    @Override
    public void deleteReview(int reviewId) {}
}
