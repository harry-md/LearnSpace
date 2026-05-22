package com.learnspace.learnspacebackend.services.impl;

import com.cloudinary.Cloudinary;
import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.services.LessonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<LessonListDto> getLessons(int chapterId) {
        return lessonRepository.getLessons(chapterId).stream()
                .map(lessonMapper::toListDto)
                .toList();
    }

    @Override
    public LessonDto getLesson(int lessonId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getLesson'");
    }

    @Override
    public LessonDto addOrUpdateLesson(
            int chapterId, Map<String, String> lesson, MultipartFile video) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'addOrUpdateLesson'");
    }
}
