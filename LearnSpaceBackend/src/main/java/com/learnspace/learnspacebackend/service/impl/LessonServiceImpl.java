package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.lesson.LessonDto;
import com.learnspace.learnspacebackend.dto.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.*;
import com.learnspace.learnspacebackend.mapper.LessonMapper;
import com.learnspace.learnspacebackend.mapper.LessonProgressMapper;
import com.learnspace.learnspacebackend.repository.*;
import com.learnspace.learnspacebackend.service.LessonService;
import com.learnspace.learnspacebackend.service.R2Service;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequiredArgsConstructor
@Service
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonProgressMapper lessonProgressMapper;
    private final LessonMapper lessonMapper;
    private final R2Service r2Service;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void checkCourseOwner(Course course) {
        if (!course.getTeacher().getId().equals(getPrincipal().getId())) {
            throw new AccessDeniedException("Không có quyền");
        }
    }

    private void checkLessonAccess(Lesson lesson) {
        Chapter chapter = lesson.getChapter();
        Course course = chapter.getCourse();
        CustomUserDetails principal = getPrincipal();

        if (course.getTeacher().getId().equals(principal.getId())) {
            return;
        }
        if (chapter.isFree()) {
            return;
        }
        if (!enrollmentRepository.checkValidEnrollment(principal.getId(), course.getId())) {
            throw new RuntimeException("Không có đăng ký học");
        }
    }

    @Override
    public LessonDto getLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        checkLessonAccess(lesson);
        CustomUserDetails principal = getPrincipal();
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
