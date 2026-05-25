package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.EnrollmentDto;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.EnrollmentMapper;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private EnrollmentMapper enrollmentMapper;

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
            throw new AccessDeniedException("Bạn không có quyền truy cập enrollment này");
        }
        return enrollmentMapper.toDto(enrollment);
    }
}
