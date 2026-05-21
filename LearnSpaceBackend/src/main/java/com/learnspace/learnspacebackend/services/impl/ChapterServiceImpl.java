package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.ChapterMapper;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.ChapterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @Override
    public List<ChapterDto> getChapters(int courseId) {
        if (courseRepository.getCourseById(courseId) == null) {
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
            throw new AccessDeniedException(
                    "Bạn không có quyền chỉnh sửa nội dung của khóa học này");
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

        return chapterMapper.toDto(chapterRepository.createOrUpdate(chapter));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public ChapterDto updateChapter(int chapterId, ChapterDto chapterDto) {
        Chapter existingChapter = chapterRepository.getChapterById(chapterId);
        if (existingChapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(existingChapter.getCourse());

        chapterMapper.updateEntityFromDto(existingChapter, chapterDto);

        return chapterMapper.toDto(chapterRepository.createOrUpdate(existingChapter));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteChapter(int chapterId) {
        Chapter existingChapter = chapterRepository.getChapterById(chapterId);
        if (existingChapter == null) {
            throw new ResourceNotFoundException("Không tìm thấy chương học");
        }

        verifyCourseOwner(existingChapter.getCourse());

        chapterRepository.deleteChapter(chapterId);
    }
}
