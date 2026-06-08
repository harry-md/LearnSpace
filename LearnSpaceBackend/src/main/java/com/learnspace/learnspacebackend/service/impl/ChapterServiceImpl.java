package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dto.chapter.ChapterPatchDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.Chapter;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.ChapterMapper;
import com.learnspace.learnspacebackend.repository.ChapterRepository;
import com.learnspace.learnspacebackend.repository.CourseRepository;
import com.learnspace.learnspacebackend.repository.LessonRepository;
import com.learnspace.learnspacebackend.service.ChapterService;
import com.learnspace.learnspacebackend.service.R2Service;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class ChapterServiceImpl implements ChapterService {
    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final ChapterMapper chapterMapper;
    private final LessonRepository lessonRepository;
    private final R2Service r2Service;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void isCourseOwner(int courseId) {
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!isAdmin) {
            boolean isOwner = courseRepository.existsByIdAndTeacherId(courseId, principal.getId());
            if (!isOwner) {
                throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này!");
            }
        }
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

    @Override
    public ChapterDto createChapter(int courseId, ChapterDto chapterDto) {
        isCourseOwner(courseId);

        Chapter chapter = chapterMapper.toEntity(chapterDto);

        Course courseProxy = courseRepository.getReferenceById(courseId);
        chapter.setCourse(courseProxy);

        return chapterMapper.toDto(chapterRepository.save(chapter));
    }

    @Override
    public ChapterDto updateChapter(int chapterId, ChapterPatchDto chapterDto) {
        isChapterOwner(chapterId);

        Chapter chapter = chapterRepository
                .findById(chapterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy chương học"));
        chapterMapper.updateEntityFromDto(chapter, chapterDto);

        Chapter updatedChapter = chapterRepository.save(chapter);
        return chapterMapper.toDto(updatedChapter);
    }

    @Override
    public void deleteChapter(int chapterId) {
        isChapterOwner(chapterId);

        List<String> videoUrls = lessonRepository.getVideoUrlsByChapterId(chapterId);
        r2Service.deleteVideos(videoUrls);

        chapterRepository.deleteById(chapterId);
    }
}
