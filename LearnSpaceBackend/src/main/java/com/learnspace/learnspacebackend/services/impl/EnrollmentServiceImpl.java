package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.enrollment.EnrollmentDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.mappers.EnrollmentMapper;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.EnrollmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentMapper enrollmentMapper;

    @Autowired
    private CourseMapper courseMapper;

    private CustomUserDetails getLoggedInPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public EnrollmentDto getEnrollment(int enrollmentId) {
        CustomUserDetails principal = getLoggedInPrincipal();
        Enrollment enrollment = enrollmentRepository.getEnrollmentById(enrollmentId);
        if (enrollment == null) {
            throw new ResourceNotFoundException("Không tìm thấy enrollment cho khóa học này");
        }
        User student = enrollment.getStudent();
        if (!student.getId().equals(principal.getId())) {
            throw new AccessDeniedException("Bạn không có quyền truy cập");
        }
        return enrollmentMapper.toDto(enrollment);
    }

    @Override
    public List<CourseDto> getMyEnrollments() {
        CustomUserDetails principal = getLoggedInPrincipal();
        List<Enrollment> enrollments =
                enrollmentRepository.getEnrollmentsByStudentId(principal.getId());
        List<CourseDto> courses = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            courses.add(courseMapper.toDto(enrollment.getCourse()));
        }
        return courses;
    }

    @Override
    public EnrollmentDto createEnrollment(int courseId) {
        CustomUserDetails principal = getLoggedInPrincipal();
        User student = userRepository.getUserById(principal.getId());

        if (student == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin tài khoản của bạn.");
        }

        Course course = courseRepository.getCourseById(courseId);
        if (course == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học");
        }
        if (enrollmentRepository.checkValidEnrollment(student.getId(), courseId)) {
            throw new IllegalArgumentException("Bạn đã đăng ký khóa học này rồi");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        if (course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
        } else {
            enrollment.setStatus(EnrollmentStatus.PENDING);
        }

        return enrollmentMapper.toDto(enrollmentRepository.addOrUpdateEnrollment(enrollment));
    }
}
