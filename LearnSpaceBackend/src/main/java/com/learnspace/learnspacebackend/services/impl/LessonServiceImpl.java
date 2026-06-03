package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonListDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
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

import java.io.File;
import java.io.IOException;
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
            throw new AccessDeniedException("Bạn không có quyền thực hiện hành động này");
        }
    }

    private void verifyLessonAccess(Lesson lesson) {
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
            throw new AccessDeniedException("Bạn cần mua khóa học này để xem bài học");
        }
    }

    @Override
    public List<LessonListDto> getLessons(int chapterId) {
        return lessonRepository.getLessons(chapterId).stream()
                .map(lessonMapper::toListDto)
                .toList();
    }

    @Override
    public LessonDto getLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        verifyLessonAccess(lesson);
        return lessonMapper.toDto(lesson);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto createLesson(int chapterId, LessonDto lessonDto) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        verifyCourseOwner(chapter.getCourse());

        if (lessonDto.videoFile() == null || lessonDto.videoFile().isEmpty()) {
            throw new IllegalArgumentException("Tạo bài học phải có video");
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
            lesson.setOrder(lessonRepository.getMaxOrder(chapterId) + 1000);

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

    private int calculateNewOrder(Integer frontLessonId, Integer behindLessonId) {
        if (frontLessonId == null) {
            return lessonRepository.getLessonById(behindLessonId).getOrder() / 2;
        }
        if (behindLessonId == null) {
            return lessonRepository.getLessonById(frontLessonId).getOrder() + 1000;
        }
        Lesson frontLesson = lessonRepository.getLessonById(frontLessonId);
        Lesson behindLesson = lessonRepository.getLessonById(behindLessonId);
        return (frontLesson.getOrder() + behindLesson.getOrder()) / 2;
    }

    private void checkAndReorderLesson(int chapterId) {
        List<Lesson> lessons = lessonRepository.getLessons(chapterId);
        if (lessons.size() < 2) return;
        boolean needRebalance = false;
        for (int i = 1; i < lessons.size(); i++) {
            int gap = lessons.get(i).getOrder() - lessons.get(i - 1).getOrder();
            if (gap <= 1) {
                needRebalance = true;
                break;
            }
        }
        if (needRebalance) {
            for (int i = 0; i < lessons.size(); i++) {
                lessons.get(i).setOrder((i + 1) * 1000);
            }
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto updateLesson(int lessonId, LessonPatchDto lessonDto) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        verifyCourseOwner(lesson.getChapter().getCourse());

        lessonMapper.updateEntityFromDto(lesson, lessonDto);

        if (lessonDto.frontLessonId() != null || lessonDto.behindLessonId() != null) {
            int newOrder = calculateNewOrder(lessonDto.frontLessonId(), lessonDto.behindLessonId());
            lesson.setOrder(newOrder);
        }

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

        if (lessonDto != null
                && (lessonDto.frontLessonId() != null || lessonDto.behindLessonId() != null)) {
            checkAndReorderLesson(lesson.getChapter().getId());
        }

        return lessonMapper.toDto(updatedLesson);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteLesson(int lessonId) {
        Lesson lesson = lessonRepository.getLessonById(lessonId);
        verifyCourseOwner(lesson.getChapter().getCourse());

        r2Service.deleteVideo(lesson.getVideo());

        lessonRepository.deleteLesson(lessonId);
    }
}
