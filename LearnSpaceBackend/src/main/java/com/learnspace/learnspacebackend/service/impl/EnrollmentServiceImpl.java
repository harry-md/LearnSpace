package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.enrollment.EnrollmentDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;
import com.learnspace.learnspacebackend.entity.User;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.EnrollmentMapper;
import com.learnspace.learnspacebackend.repository.CourseRepository;
import com.learnspace.learnspacebackend.repository.EnrollmentRepository;
import com.learnspace.learnspacebackend.repository.UserRepository;
import com.learnspace.learnspacebackend.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentMapper enrollmentMapper;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public EnrollmentDto createEnrollment(int courseId) {
        CustomUserDetails principal = getPrincipal();
        if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, principal.getId())) {
            throw new IllegalArgumentException("Bạn đã đăng ký khóa học này rồi");
        }

        User student = userRepository.getReferenceById(principal.getId());
        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy khóa học"));

        Enrollment enrollment = new Enrollment();
        if (course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
        } else {
            throw new IllegalArgumentException("Khóa học có phí, cần tiến hành thanh toán");
        }
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        return enrollmentMapper.toDto(enrollmentRepository.save(enrollment));
    }
}
