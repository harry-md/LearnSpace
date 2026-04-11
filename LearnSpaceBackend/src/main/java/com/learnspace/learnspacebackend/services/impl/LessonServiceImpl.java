package com.learnspace.learnspacebackend.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
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
    private LessonMapper lessonMapper;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<LessonDto> getLessons(int chapterId) {
        return lessonRepository.getLessons(chapterId).stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    @Override
    public LessonDto addOrUpdateLesson(
            int chapterId, Map<String, String> lessonMap, MultipartFile video) {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonMap.get("title"));
        lesson.setContent(lessonMap.get("content"));
        lesson.setOrder(Integer.parseInt(lessonMap.get("order")));

        try {
            Map res = cloudinary
                    .uploader()
                    .upload(video.getBytes(), ObjectUtils.asMap("resource_type", "video"));
            lesson.setVideo(res.get("secure_url").toString());
            lesson.setVideoLength((int) Double.parseDouble(res.get("duration").toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        lesson.setChapter(chapterRepository.getChapterById(chapterId));
        return lessonMapper.toDto(lessonRepository.addOrUpdateLesson(lesson));
    }
}
