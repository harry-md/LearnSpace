package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;
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
    public LessonProgressDto addLessonProgress(int lessonId, LessonProgressDto lessonProgressDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        Course course = lesson.getChapter().getCourse();
        int userId = getLoggedInPrincipal().getId();
        Enrollment enrollment = enrollmentRepository.getEnrollmentByStudentAndCourse(
                userId, course.getId(), EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED);

        if (enrollment == null) {
            throw new AccessDeniedException("Bạn chưa đăng ký khóa học này");
        }
        LessonProgress p =
                lessonProgressRepository.getLessonProgressByStudentAndLesson(userId, lessonId);

        if (p != null) {
            p.setWatchedSec(lessonProgressDto.watchedSec());
            return lessonProgressMapper.toDto(
                    lessonProgressRepository.addOrUpdateLessonProgress(p));
        }

        LessonProgress progress = lessonProgressMapper.toEntity(lessonProgressDto);
        progress.setLesson(lesson);
        progress.setStudent(enrollment.getStudent());
        return lessonProgressMapper.toDto(
                lessonProgressRepository.addOrUpdateLessonProgress(progress));
    }

    @Override
    public LessonProgressDto updateLessonProgress(
            int lessonId, LessonProgressDto lessonProgressDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        Course course = lesson.getChapter().getCourse();
        int userId = getLoggedInPrincipal().getId();
        Enrollment enrollment = enrollmentRepository.getEnrollmentByStudentAndCourse(
                userId, course.getId(), EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED);

        if (enrollment == null) {
            throw new AccessDeniedException("Bạn chưa đăng ký khóa học này");
        }
        LessonProgress existing =
                lessonProgressRepository.getLessonProgressByStudentAndLesson(userId, lessonId);

        if (existing != null) {
            existing.setWatchedSec(lessonProgressDto.watchedSec());
            if (existing.getWatchedSec() >= lesson.getVideoLength()) {
                existing.setCompleted(true);
            }
            return lessonProgressMapper.toDto(
                    lessonProgressRepository.addOrUpdateLessonProgress(existing));
        }

        LessonProgress progress = lessonProgressMapper.toEntity(lessonProgressDto);
        progress.setWatchedSec(lessonProgressDto.watchedSec());
        progress.setLesson(lesson);

        if (progress.getWatchedSec() >= lesson.getVideoLength()) {
            progress.setCompleted(true);
        }
        return lessonProgressMapper.toDto(
                lessonProgressRepository.addOrUpdateLessonProgress(progress));
    }
}
