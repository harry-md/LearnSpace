package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonListDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;
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
import java.io.FileInputStream;
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
    private LessonProgressRepository progressRepository;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private LessonProgressMapper progressMapper;

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

        if (chapter.getFree()) {
            return;
        }

        if (!enrollmentRepository.checkValidEnrollment(principal.getId(), course.getId())) {
            throw new AccessDeniedException("Bạn cần mua khóa học này để xem bài học");
        }
    }

    @Override
    public List<LessonListDto> getLessons(int chapterId) {
        if (!chapterRepository.existChapter(chapterId)) {
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

        CustomUserDetails principal = getLoggedInPrincipal();

        LessonProgress progress =
                progressRepository.getLessonProgressByLessonAndStudent(lessonId, principal.getId());

        LessonProgressDto progressDto = null;
        if (progress != null) {
            progressDto = progressMapper.toDto(progress);
        }
        return lessonMapper.toDtoWithProgress(lesson, progressDto);
    }

    private void validateMp4File(File file) throws IOException {
        if (file.length() < 8) {
            throw new RuntimeException("File quá nhỏ");
        }

        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            byte[] header = new byte[8];
            if (fileInputStream.read(header) < 8) {
                throw new IllegalArgumentException("Không thể đọc header file");
            }

            boolean isMp4 =
                    header[4] == 'f' && header[5] == 't' && header[6] == 'y' && header[7] == 'p';

            if (!isMp4) {
                throw new RuntimeException("Chỉ chấp nhận upload file mp4");
            }
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public LessonDto createLesson(int chapterId, LessonDto lessonDto) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        if (chapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(chapter.getCourse());

        MultipartFile videoFile = lessonDto.videoFile();
        if (videoFile.isEmpty()) {
            throw new RuntimeException("File không được trống");
        }

        File tmpFile = null;
        try {
            tmpFile = File.createTempFile("video-", ".mp4");
            videoFile.transferTo(tmpFile);

            validateMp4File(tmpFile);

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

        Lesson existingLesson = lessonRepository.getLessonById(lessonId);
        if (existingLesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyCourseOwner(existingLesson.getChapter().getCourse());

        lessonMapper.updateEntityFromDto(existingLesson, lessonDto);

        if (lessonDto.frontLessonId() != null || lessonDto.behindLessonId() != null) {
            int newOrder = calculateNewOrder(lessonDto.frontLessonId(), lessonDto.behindLessonId());
            existingLesson.setOrder(newOrder);
        }

        MultipartFile videoFile = lessonDto.videoFile();
        if (videoFile != null && !videoFile.isEmpty()) {
            String oldVideoUrl = existingLesson.getVideo();
            if (oldVideoUrl != null && !oldVideoUrl.isBlank()) {
                r2Service.deleteVideo(oldVideoUrl);
            }

            File tmpFile = null;
            try {
                tmpFile = File.createTempFile("video-", ".mp4");
                videoFile.transferTo(tmpFile);
                validateMp4File(tmpFile);

                String videoUrl =
                        r2Service.uploadVideo(tmpFile, videoFile.getContentType(), "lessons");
                int videoLength = r2Service.getVideoLength(tmpFile);

                existingLesson.setVideo(videoUrl);
                existingLesson.setVideoLength(videoLength);

            } catch (Exception ex) {
                System.err.println(ex.getMessage());
                throw new RuntimeException("Lỗi khi xử lý video");
            } finally {
                if (tmpFile != null && tmpFile.exists()) {
                    tmpFile.delete();
                }
            }
        }

        Lesson updatedLesson = lessonRepository.addOrUpdateLesson(existingLesson);

        if (lessonDto != null
                && (lessonDto.frontLessonId() != null || lessonDto.behindLessonId() != null)) {
            checkAndReorderLesson(existingLesson.getChapter().getId());
        }

        return lessonMapper.toDto(updatedLesson);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteLesson(int lessonId) {
        Lesson existingLesson = lessonRepository.getLessonById(lessonId);
        if (existingLesson == null) {
            throw new ResourceNotFoundException("Không tìm thấy bài học");
        }

        verifyCourseOwner(existingLesson.getChapter().getCourse());

        r2Service.deleteVideo(existingLesson.getVideo());

        lessonRepository.deleteLesson(lessonId);
    }
}
