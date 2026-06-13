package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.lesson.LessonDto;
import com.learnspace.learnspacebackend.dto.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.*;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.LessonMapper;
import com.learnspace.learnspacebackend.mapper.LessonProgressMapper;
import com.learnspace.learnspacebackend.repository.*;
import com.learnspace.learnspacebackend.service.LessonService;
import com.learnspace.learnspacebackend.service.R2Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RequiredArgsConstructor
@Slf4j
@Service
public class LessonServiceImpl implements LessonService {
    private final TransactionTemplate transactionTemplate;
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

    private void isChapterOwner(int chapterId) {
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!isAdmin) {
            boolean isOwner =
                    chapterRepository.existsByIdAndCourseTeacherId(chapterId, principal.getId());
            if (!isOwner) {
                throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này!");
            }
        }
    }

    private void isLessonOwner(int lessonId) {
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!isAdmin) {
            boolean isOwner = lessonRepository.existsByIdAndChapterCourseTeacherId(
                    lessonId, principal.getId());
            if (!isOwner) {
                throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này!");
            }
        }
    }

    private void checkLessonAccess(Lesson lesson) {
        Chapter chapter = lesson.getChapter();
        Course course = chapter.getCourse();
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        boolean isOwner = course.getTeacher().getId().equals(principal.getId());

        if (isAdmin || isOwner) {
            return;
        }
        if (chapter.isFree()) {
            return;
        }
        if (!enrollmentRepository.existsByCourseAndStudentId(course.getId(), principal.getId())) {
            throw new AccessDeniedException("Cần đăng ký khóa học để xem bài học");
        }
    }

    private Lesson getLessonOrThrow(int lessonId) {
        return lessonRepository
                .findById(lessonId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy bài học"));
    }

    @Override
    @Transactional(readOnly = true)
    public LessonDto getLesson(int lessonId) {
        Lesson lesson = getLessonOrThrow(lessonId);

        checkLessonAccess(lesson);

        CustomUserDetails principal = getPrincipal();
        LessonProgress lessonProgress = lessonProgressRepository
                .findByLessonAndStudentId(lessonId, principal.getId())
                .orElse(null);
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getVideo(),
                lesson.getVideoLength(),
                lesson.getDisplayOrder(),
                lessonProgressMapper.toDto(lessonProgress),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt(),
                null);
    }

    @Override
    public LessonDto createLesson(int chapterId, LessonDto lessonDto) {
        isChapterOwner(chapterId);

        if (lessonDto.videoFile() == null || lessonDto.videoFile().isEmpty()) {
            throw new IllegalArgumentException("Phải gửi video khi tạo bài học");
        }

        MultipartFile videoFile = lessonDto.videoFile();
        File tmpFile = null;
        String rollbackVideoUrl = null;
        try {
            tmpFile = File.createTempFile("video-", ".mp4");
            videoFile.transferTo(tmpFile);

            r2Service.validateMp4File(tmpFile);

            final String videoUrl =
                    r2Service.uploadVideo(tmpFile, videoFile.getContentType(), "lessons");
            rollbackVideoUrl = videoUrl;
            final int videoLength = r2Service.getVideoLength(tmpFile);

            return transactionTemplate.execute(status -> {
                try {
                    Lesson lesson = lessonMapper.toEntity(lessonDto);
                    lesson.setChapter(chapterRepository.getReferenceById(chapterId));
                    lesson.setVideo(videoUrl);
                    lesson.setVideoLength(videoLength);
                    return lessonMapper.toDto(lessonRepository.save(lesson));
                } catch (Exception dbEx) {
                    status.setRollbackOnly();
                    throw dbEx;
                }
            });
        } catch (Exception ex) {
            log.error("Lỗi xử lý tạo bài học", ex);
            if (rollbackVideoUrl != null) {
                try {
                    log.info(
                            "Tiến hành rollback xóa video trên R2 do lỗi hệ thống",
                            rollbackVideoUrl,
                            ex);
                    r2Service.deleteVideo(rollbackVideoUrl);
                } catch (Exception deleteEx) {
                    log.error(
                            "Có lỗi trong quá trình rollback. Không xóa được video: {}",
                            rollbackVideoUrl,
                            deleteEx);
                }
            }
            throw new RuntimeException("Có lỗi khi tạo bài học");
        } finally {
            if (tmpFile != null && tmpFile.exists()) tmpFile.delete();
        }
    }

    @Override
    public LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto) {
        isLessonOwner(lessonId);

        Lesson lesson = getLessonOrThrow(lessonId);
        lessonMapper.updateEntityFromDto(lesson, lessonDto);

        MultipartFile videoFile = lessonDto.videoFile();
        if (videoFile != null && !videoFile.isEmpty()) {
            String oldVideoUrl = lesson.getVideo();
            if (oldVideoUrl != null && !oldVideoUrl.isBlank()) {
                r2Service.deleteVideo(oldVideoUrl);
            }

            File tmpFile = null;
            String rollbackVideoUrl = null;
            try {
                tmpFile = File.createTempFile("video-", ".mp4");
                videoFile.transferTo(tmpFile);

                r2Service.validateMp4File(tmpFile);

                final String videoUrl =
                        r2Service.uploadVideo(tmpFile, videoFile.getContentType(), "lessons");
                rollbackVideoUrl = videoUrl;
                final int videoLength = r2Service.getVideoLength(tmpFile);

                return transactionTemplate.execute(status -> {
                    try {

                        lesson.setVideo(videoUrl);
                        lesson.setVideoLength(videoLength);
                        return lessonMapper.toDto(lessonRepository.save(lesson));
                    } catch (Exception dbEx) {
                        status.setRollbackOnly();
                        throw dbEx;
                    }
                });
            } catch (Exception ex) {
                log.error("Lỗi xử lý cập nhật bài học", ex);
                if (rollbackVideoUrl != null) {
                    try {
                        log.info(
                                "Tiến hành rollback xóa video trên R2 do lỗi hệ thống",
                                rollbackVideoUrl,
                                ex);
                        r2Service.deleteVideo(rollbackVideoUrl);
                    } catch (Exception deleteEx) {
                        log.error(
                                "Có lỗi trong quá trình rollback. Không xóa được video: {}",
                                rollbackVideoUrl,
                                deleteEx);
                    }
                }
                throw new RuntimeException("Lỗi khi xử lý video");
            } finally {
                if (tmpFile != null && tmpFile.exists()) tmpFile.delete();
            }
        }
        return transactionTemplate.execute(status -> {
            return lessonMapper.toDto(lessonRepository.save(lesson));
        });
    }

    @Override
    public void deleteLesson(int lessonId) {
        isLessonOwner(lessonId);

        Lesson lesson = getLessonOrThrow(lessonId);

        r2Service.deleteVideo(lesson.getVideo());
        lessonRepository.deleteById(lessonId);
    }
}
