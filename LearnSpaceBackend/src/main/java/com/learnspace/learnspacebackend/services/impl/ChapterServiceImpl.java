package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.dtos.ChapterPatchDto;
import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.ChapterMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.ChapterService;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ChapterServiceImpl implements ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChapterMapper chapterMapper;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private R2Service r2Service;

    @Override
    public List<ChapterDto> getChapters(int courseId) {
        if (!courseRepository.existCourse(courseId)) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học");
        }
        return chapterRepository.getChaptersByCourse(courseId).stream()
                .map(chapterMapper::toDto)
                .toList();
    }

    @Override
    public ChapterDto getChapter(int chapterId) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        if (chapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }
        return chapterMapper.toDto(chapter);
    }

    private User getLoggedInTeacher() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.getUserById(principal.getId());
    }

    private void verifyCourseOwner(Course course) {
        User teacher = getLoggedInTeacher();
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này");
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public ChapterDto createChapter(int courseId, ChapterDto chapterDto) {
        Course course = courseRepository.getCourseById(courseId);
        if (course == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học");
        }

        verifyCourseOwner(course);

        Chapter chapter = chapterMapper.toEntity(chapterDto);
        chapter.setCourse(course);
        chapter.setOrder(chapterRepository.getMaxOrder(courseId) + 1000);

        return chapterMapper.toDto(chapterRepository.createOrUpdate(chapter));
    }

    private int calculateNewOrder(Integer frontChapterId, Integer behindChapterId) {
        if (frontChapterId == null) {
            return chapterRepository.getChapterById(behindChapterId).getOrder() / 2;
        }
        if (behindChapterId == null) {
            return chapterRepository.getChapterById(frontChapterId).getOrder() + 1000;
        }
        Chapter frontChapter = chapterRepository.getChapterById(frontChapterId);
        Chapter behindChapter = chapterRepository.getChapterById(behindChapterId);
        return (frontChapter.getOrder() + behindChapter.getOrder()) / 2;
    }

    private void checkAndReorderChapter(int courseId) {
        List<Chapter> chapters = chapterRepository.getChaptersByCourse(courseId);
        if (chapters.size() < 2) {
            return;
        }

        boolean needRebalance = false;
        for (int i = 1; i < chapters.size(); i++) {
            int gap = chapters.get(i).getOrder() - chapters.get(i - 1).getOrder();
            if (gap <= 1) {
                needRebalance = true;
                break;
            }
        }

        if (needRebalance) {
            for (int i = 0; i < chapters.size(); i++) {
                chapters.get(i).setOrder((i + 1) * 1000);
            }
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto) {
        Chapter existingChapter = chapterRepository.getChapterById(chapterId);
        if (existingChapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(existingChapter.getCourse());

        chapterMapper.updateEntityFromDto(existingChapter, chapterDto);
        if (chapterDto.frontChapterId() != null || chapterDto.behindChapterId() != null) {
            int newOrder =
                    calculateNewOrder(chapterDto.frontChapterId(), chapterDto.behindChapterId());
            existingChapter.setOrder(newOrder);
        }

        Chapter updatedChapter = chapterRepository.createOrUpdate(existingChapter);

        if (chapterDto.frontChapterId() != null || chapterDto.behindChapterId() != null) {
            checkAndReorderChapter(existingChapter.getCourse().getId());
        }
        return chapterMapper.toDto(updatedChapter);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteChapter(int chapterId) {
        Chapter existingChapter = chapterRepository.getChapterById(chapterId);
        if (existingChapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(existingChapter.getCourse());

        List<String> videoUrls = lessonRepository.getVideoUrlsByChapterId(chapterId);
        r2Service.deleteVideos(videoUrls);

        chapterRepository.deleteChapter(chapterId);
    }
}
