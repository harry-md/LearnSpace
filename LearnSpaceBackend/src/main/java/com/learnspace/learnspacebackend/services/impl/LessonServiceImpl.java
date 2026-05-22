package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;
import com.learnspace.learnspacebackend.dtos.LessonPatchDto;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.LessonService;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private R2Service r2Service;

    private CustomUserDetails getLoggedInPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private User getLoggedInTeacher() {
        return userRepository.getUserById(getLoggedInPrincipal().getId());
    }

    private void verifyCourseOwner(Course course) {
        User teacher = getLoggedInTeacher();
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException(
                    "Bạn không có quyền chỉnh sửa nội dung của khóa học này");
        }
    }

    private void verifyLessonAccess(Lesson lesson) {
        Chapter chapter = lesson.getChapter();
        Course course = chapter.getCourse();
        CustomUserDetails principal = getLoggedInPrincipal();

        if (course.getTeacher().getId().equals(principal.getId())) {
            return;
        }

        if (chapter.getFree()) {
            return;
        }

        if (!enrollmentRepository.hasValidEnrollment(principal.getId(), course.getId())) {
            throw new AccessDeniedException("Bạn cần mua khóa học này để xem bài học");
        }
    }

    @Override
    public List<LessonListDto> getLessons(int chapterId) {
        if (chapterRepository.getChapterById(chapterId) == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }
        return lessonRepository.getLessons(chapterId).stream()
                .map(lessonMapper::toListDto)
                .toList();
    }

    @Override
    public LessonDto getLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        if (lesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyLessonAccess(lesson);

        return lessonMapper.toDto(lesson);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto createLesson(int chapterId, LessonDto lessonDto, MultipartFile video) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        if (chapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(chapter.getCourse());

        String videoUrl = r2Service.uploadFile(video, "lessons");
        int videoLength = r2Service.getVideoLength(video);

        Lesson lesson = lessonMapper.toEntity(lessonDto);
        lesson.setChapter(chapter);
        lesson.setVideo(videoUrl);
        lesson.setVideoLength(videoLength);

        return lessonMapper.toDto(lessonRepository.addOrUpdateLesson(lesson));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto) {
        Lesson existingLesson = lessonRepository.getLessonById(lessonId);
        if (existingLesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyCourseOwner(existingLesson.getChapter().getCourse());

        lessonMapper.updateEntityFromDto(existingLesson, lessonDto);

        return lessonMapper.toDto(lessonRepository.addOrUpdateLesson(existingLesson));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto updateLessonVideo(int lessonId, MultipartFile video) {
        Lesson existingLesson = lessonRepository.getLessonById(lessonId);
        if (existingLesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyCourseOwner(existingLesson.getChapter().getCourse());

        String videoUrl = r2Service.uploadFile(video, "lessons");
        int videoLength = r2Service.getVideoLength(video);

        existingLesson.setVideo(videoUrl);
        existingLesson.setVideoLength(videoLength);

        return lessonMapper.toDto(lessonRepository.addOrUpdateLesson(existingLesson));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteLesson(int lessonId) {
        Lesson existingLesson = lessonRepository.getLessonById(lessonId);
        if (existingLesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyCourseOwner(existingLesson.getChapter().getCourse());

        lessonRepository.deleteLesson(lessonId);
    }
}
