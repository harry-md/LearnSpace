package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.LessonProgressDto;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.pojo.Enrollment;

import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.LessonProgress;

import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;

import com.learnspace.learnspacebackend.services.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LessonProgressServiceImpl implements LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonProgressMapper lessonProgressMapper;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    private CustomUserDetails getLoggedInPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public LessonProgressDto getLessonProgress(int progressId) {

        LessonProgress lessonProgress = lessonProgressRepository.getLessonProgressById(progressId);
        if (lessonProgress == null) {
            throw new ResourceNotFoundException("Không tìm thấy tiến độ học tập");
        }

        Enrollment enrollment = lessonProgress.getEnrollment();
        if (enrollment == null) {
            throw new ResourceNotFoundException("Không tìm thấy enrollment");
        }

        if (!getLoggedInPrincipal().getId().equals(enrollment.getStudent().getId())) {
            throw new AccessDeniedException("Bạn không có quyền truy cập tiến độ học tập này");
        }

        return lessonProgressMapper.toDto(lessonProgress);
    }

    @Override
    public LessonProgressDto addLessonProgress(int lessonId, LessonProgressDto lessonProgressDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        if (lesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }
        Enrollment enrollment = enrollmentRepository.getEnrollmentById(lessonProgressDto.enrollmentId());
        if (enrollment == null) {
            throw new ResourceNotFoundException("Không tìm thấy enrollment");
        }
        LessonProgress lessonProgress = lessonProgressMapper.toEntity(lessonProgressDto);
        lessonProgress.setLesson(lesson);
        lessonProgress.setEnrollment(enrollment);

        return lessonProgressMapper.toDto(lessonProgressRepository.addOrUpdateLessonProgress(lessonProgress));
    }
}
