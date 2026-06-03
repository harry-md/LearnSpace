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
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Override
    public PaginatedResponseDto<ReviewDto> getReviewsByCourse(int courseId, Map<String, String> params) {

        List<ReviewDto> results = reviewRepository.getReviewsByCourse(courseId, params).stream()
                .map(reviewMapper::toDto)
                .toList();

        return PaginatedResponseMapper.toPaginatedResponseDto(
                reviewRepository.countReviewsByCourse(courseId, params),
                Integer.parseInt(params.get("page")),
                REVIEW_PAGE_SIZE,
                results);
    }

    private User getLoggedInStudent() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.getUserById(principal.getId());
    }

    private boolean verifyReviewOwner(Review review, User student) {
        return review.getStudent().getId().equals(student.getId());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @Override
    public ReviewDto addReview(int courseId, ReviewDto reviewDto) {
        Course course = courseRepository.getCourseById(courseId);
        if (course == null) throw new RuntimeException("Khóa học không tồn tại");

        User user = userRepository.getUserById(getLoggedInStudent().getId());
        if (user == null) throw new RuntimeException("Người dùng không tồn tại");

        Review review = reviewMapper.toEntity(reviewDto);
        review.setCourse(course);
        review.setStudent(user);

        reviewRepository.addOrUpdateReview(review);

        return reviewMapper.toDto(review);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @Override
    public ReviewDto updateReview(int reviewId, ReviewDto reviewDto) {
        User currentUser = userRepository.getUserById(getLoggedInStudent().getId());
        Review review = reviewRepository.getReviewById(reviewId);
        if (review == null) throw new RuntimeException("Đánh giá không tồn tại");
        if (!verifyReviewOwner(review, currentUser))
            throw new RuntimeException("Bạn không có quyền chỉnh sửa đánh giá này");
        if (reviewDto.rating() != null) review.setRating(reviewDto.rating());
        if (reviewDto.comment() != null) review.setComment(reviewDto.comment());

        return reviewMapper.toDto(reviewRepository.addOrUpdateReview(review));
    }

    @Override
    public void deleteReview(int reviewId) {}
}
