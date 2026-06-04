package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.repositories.*;
import com.learnspace.learnspacebackend.services.LessonService;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class LessonServiceImpl implements LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonProgressMapper lessonProgressMapper;

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

    private void checkCourseOwner(Course course) {
        User teacher = getLoggedInTeacher();
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Không có quyền");
        }
    }

    private void checkLessonAccess(Lesson lesson) {
        Chapter chapter = lesson.getChapter();
        Course course = chapter.getCourse();
        CustomUserDetails principal = getLoggedInPrincipal();

        if (course.getTeacher().getId().equals(principal.getId())) {
            return;
        }

        if (chapter.isFree()) {
            return;
        }

        if (!enrollmentRepository.checkValidEnrollment(principal.getId(), course.getId())) {
            throw new RuntimeException("Không có enrollment");
        }
    }

    @Override
    public LessonDto getLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        checkLessonAccess(lesson);
        CustomUserDetails principal = getLoggedInPrincipal();
        LessonProgress lessonProgress =
                lessonProgressRepository.getLessonProgressByStudentAndLesson(
                        principal.getId(), lessonId);
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getVideo(),
                lesson.getVideoLength(),
                lesson.getOrder(),
                lessonProgressMapper.toDto(lessonProgress),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt(),
                null);
    }

    @Override
    public LessonDto createLesson(int chapterId, LessonDto lessonDto) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        checkCourseOwner(chapter.getCourse());
        if (lessonDto.videoFile() == null || lessonDto.videoFile().isEmpty()) {
            throw new RuntimeException("Phải gửi video khi tạo bài học");
        }

        MultipartFile videoFile = lessonDto.videoFile();
        File tmpFile = null;
        try {
            tmpFile = File.createTempFile("video-", ".mp4");
            videoFile.transferTo(tmpFile);

            r2Service.validateMp4File(tmpFile);

            String videoUrl = r2Service.uploadVideo(tmpFile, videoFile.getContentType(), "lessons");
            int videoLength = r2Service.getVideoLength(tmpFile);

            Lesson lesson = lessonMapper.toEntity(lessonDto);
            lesson.setChapter(chapter);
            lesson.setVideo(videoUrl);
            lesson.setVideoLength(videoLength);
            return lessonMapper.toDto(lessonRepository.addOrUpdateLesson(lesson));

        } catch (IOException ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi khi xử lý video");
        } finally {
            if (tmpFile != null && tmpFile.exists()) {
                tmpFile.delete();
            }
        }
    }

    @Override
    public LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        checkCourseOwner(lesson.getChapter().getCourse());
        lessonMapper.updateEntityFromDto(lesson, lessonDto);

        MultipartFile videoFile = lessonDto.videoFile();
        if (videoFile != null && !videoFile.isEmpty()) {
            String oldVideoUrl = lesson.getVideo();
            if (oldVideoUrl != null && !oldVideoUrl.isBlank()) {
                r2Service.deleteVideo(oldVideoUrl);
            }

            File tmpFile = null;
            try {
                tmpFile = File.createTempFile("video-", ".mp4");
                videoFile.transferTo(tmpFile);

                r2Service.validateMp4File(tmpFile);

                String videoUrl =
                        r2Service.uploadVideo(tmpFile, videoFile.getContentType(), "lessons");
                int videoLength = r2Service.getVideoLength(tmpFile);

                lesson.setVideo(videoUrl);
                lesson.setVideoLength(videoLength);

            } catch (Exception ex) {
                System.err.println(ex.getMessage());
                throw new RuntimeException("Lỗi khi xử lý video");
            } finally {
                if (tmpFile != null && tmpFile.exists()) {
                    tmpFile.delete();
                }
            }
        }
        Lesson updatedLesson = lessonRepository.addOrUpdateLesson(lesson);
        return lessonMapper.toDto(updatedLesson);
    }

    @Override
    public void deleteLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        checkCourseOwner(lesson.getChapter().getCourse());

        r2Service.deleteVideo(lesson.getVideo());
        lessonRepository.deleteLesson(lessonId);
    }
}
