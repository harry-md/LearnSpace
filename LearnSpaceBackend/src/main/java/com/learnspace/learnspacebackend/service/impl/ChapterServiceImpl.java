package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dto.chapter.ChapterPatchDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.Chapter;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.mapper.ChapterMapper;
import com.learnspace.learnspacebackend.repository.ChapterRepository;
import com.learnspace.learnspacebackend.repository.CourseRepository;
import com.learnspace.learnspacebackend.repository.LessonRepository;
import com.learnspace.learnspacebackend.service.ChapterService;
import com.learnspace.learnspacebackend.service.R2Service;

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
    private ChapterMapper chapterMapper;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private R2Service r2Service;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void checkCourseOwner(Course course) {
        if (!course.getTeacher().getId().equals(getPrincipal().getId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này");
        }
    }

    @Override
    public ChapterDto createChapter(int courseId, ChapterDto chapterDto) {
        Course course = courseRepository.getCourseById(courseId);
        checkCourseOwner(course);

        Chapter chapter = chapterMapper.toEntity(chapterDto);
        chapter.setCourse(course);
        return chapterMapper.toDto(chapterRepository.createOrUpdate(chapter));
    }

    @Override
    public ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        checkCourseOwner(chapter.getCourse());
        chapterMapper.updateEntityFromDto(chapter, chapterDto);

        Chapter updatedChapter = chapterRepository.createOrUpdate(chapter);
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
