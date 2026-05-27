package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.progress.CourseProgressDto;
import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.pojo.Course;
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
    public LessonProgressDto getLessonProgress(int lessonId) {
        LessonProgress lessonProgress =
                lessonProgressRepository.getLessonProgressByLesson(lessonId);
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

        Course course = lesson.getChapter().getCourse();
        int userId = getLoggedInPrincipal().getId();
        Enrollment enrollment =
                enrollmentRepository.getEnrollmentByStudentAndCourse(userId, course.getId());

        if (enrollment == null) {
            throw new AccessDeniedException("Bạn chưa đăng ký khóa học này");
        }
        LessonProgress existing = lessonProgressRepository.getLessonProgressByEnrollmentAndLesson(
                enrollment.getId(), lessonId);

        if (existing != null) {
            existing.setWatchedSec(lessonProgressDto.watchedSec());
            return lessonProgressMapper.toDto(
                    lessonProgressRepository.addOrUpdateLessonProgress(existing));
        }

        LessonProgress progress = lessonProgressMapper.toEntity(lessonProgressDto);
        progress.setLesson(lesson);
        progress.setEnrollment(enrollment);
        return lessonProgressMapper.toDto(
                lessonProgressRepository.addOrUpdateLessonProgress(progress));
    }

    @Override
    public LessonProgressDto updateLessonProgress(
            int lessonId, LessonProgressDto lessonProgressDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        if (lesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        Course course = lesson.getChapter().getCourse();
        int userId = getLoggedInPrincipal().getId();
        Enrollment enrollment =
                enrollmentRepository.getEnrollmentByStudentAndCourse(userId, course.getId());

        if (enrollment == null) {
            throw new AccessDeniedException("Bạn chưa đăng ký khóa học này");
        }
        LessonProgress existing = lessonProgressRepository.getLessonProgressByEnrollmentAndLesson(
                enrollment.getId(), lessonId);

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

    @Override
    public CourseProgressDto getCourseProgress(int courseId) {
        int userId = getLoggedInPrincipal().getId();

        Enrollment enrollment =
                enrollmentRepository.getEnrollmentByStudentAndCourse(userId, courseId);
        if (enrollment == null) {
            throw new AccessDeniedException("Bạn chưa đăng ký khóa học này");
        }

        int completed =
                lessonProgressRepository.countCompletedLessonsByStudentAndCourse(userId, courseId);
        int total = lessonRepository.countLessonsByCourseId(courseId);
        int percent = 0;
        if (total > 0) {
            percent = (int) Math.round(completed * 100.0 / total);
        }

        return new CourseProgressDto(completed, total, percent);
    }
}
