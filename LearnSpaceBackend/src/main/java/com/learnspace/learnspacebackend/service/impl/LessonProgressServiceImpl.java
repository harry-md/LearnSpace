package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;
import com.learnspace.learnspacebackend.entity.Lesson;
import com.learnspace.learnspacebackend.entity.LessonProgress;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.LessonProgressMapper;
import com.learnspace.learnspacebackend.repository.EnrollmentRepository;
import com.learnspace.learnspacebackend.repository.LessonProgressRepository;
import com.learnspace.learnspacebackend.repository.LessonRepository;
import com.learnspace.learnspacebackend.service.LessonProgressService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class LessonProgressServiceImpl implements LessonProgressService {
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonProgressMapper lessonProgressMapper;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public LessonProgressDto saveLessonProgress(int lessonId, LessonProgressDto lessonProgressDto) {
        int userId = getPrincipal().getId();
        Lesson lesson = lessonRepository
                .findWithChapterAndCourseById(lessonId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy bài học"));

        LessonProgress progress = lessonProgressRepository
                .findByLessonAndStudentId(lessonId, userId)
                .orElse(null);

        if (progress == null) {
            Course course = lesson.getChapter().getCourse();
            Enrollment enrollment = enrollmentRepository
                    .findByStudentIdAndCourseIdAndStatusIn(
                            userId,
                            course.getId(),
                            List.of(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED))
                    .orElseThrow(() -> new AccessDeniedException("Bạn chưa đăng ký khóa học này"));
            progress = lessonProgressMapper.toEntity(lessonProgressDto);
            progress.setLesson(lesson);
            progress.setStudent(enrollment.getStudent());
        }
        progress.setWatchedSec(lessonProgressDto.watchedSec());
        if (progress.getWatchedSec() >= lesson.getVideoLength()) {
            progress.setCompleted(true);
        }

        return lessonProgressMapper.toDto(lessonProgressRepository.save(progress));
    }
}
