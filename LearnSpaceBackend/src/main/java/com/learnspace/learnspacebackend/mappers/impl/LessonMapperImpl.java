package com.learnspace.learnspacebackend.mappers.impl;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.pojo.Lesson;
import org.springframework.stereotype.Component;

@Component
public class LessonMapperImpl implements LessonMapper {

    @Override
    public LessonDto toDto(Lesson lesson) {
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getVideo(),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt());
    }

    @Override
    public Lesson toEntity(LessonDto lessonDto) {
        Lesson lesson = new Lesson();
        lesson.setId(lessonDto.id());
        lesson.setTitle(lessonDto.title());
        lesson.setContent(lessonDto.content());
        lesson.setVideo(lessonDto.video());
        lesson.setCreatedAt(lessonDto.createdAt());
        lesson.setUpdatedAt(lessonDto.updatedAt());
        return lesson;
    }
}
