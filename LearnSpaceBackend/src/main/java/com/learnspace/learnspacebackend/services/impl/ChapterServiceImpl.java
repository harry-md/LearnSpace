package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dtos.chapter.ChapterPatchDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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

    private User getLoggedInTeacher() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.getUserById(principal.getId());
    }

    private void checkCourseOwner(Course course) {
        User teacher = getLoggedInTeacher();
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này");
        }
    }

    @Override
    public ChapterDto createChapter(int courseId, ChapterDto chapterDto) {
        Course course = courseRepository.getCourseById(courseId);
        checkCourseOwner(course);

        Chapter chapter = chapterMapper.toEntity(chapterDto);
        chapter.setCourse(course);
        chapter.setOrder(chapterRepository.getMaxOrder(courseId) + 1000);

        return chapterMapper.toDto(chapterRepository.createOrUpdate(chapter));
    }

    private int calNewOrder(Integer frontChapterId, Integer behindChapterId) {
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
    public ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        checkCourseOwner(chapter.getCourse());

        chapterMapper.updateEntityFromDto(chapter, chapterDto);
        if (chapterDto.frontChapterId() != null || chapterDto.behindChapterId() != null) {
            int newOrder = calNewOrder(chapterDto.frontChapterId(), chapterDto.behindChapterId());
            chapter.setOrder(newOrder);
        }

        Chapter updatedChapter = chapterRepository.createOrUpdate(chapter);

        if (chapterDto.frontChapterId() != null || chapterDto.behindChapterId() != null) {
            checkAndReorderChapter(chapter.getCourse().getId());
        }
        return chapterMapper.toDto(updatedChapter);
    }

    @Override
    public void deleteChapter(int chapterId) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        checkCourseOwner(chapter.getCourse());

        List<String> videoUrls = lessonRepository.getVideoUrlsByChapterId(chapterId);
        r2Service.deleteVideos(videoUrls);

        chapterRepository.deleteChapter(chapterId);
    }
}
