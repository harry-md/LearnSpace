package com.learnspace.learnspacebackend.mappers.impl;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.mappers.LessonMapper;
import com.learnspace.learnspacebackend.pojo.Lesson;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class LessonMapperImpl implements LessonMapper {

    @Override
    public LessonDto toDto(Lesson lesson) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new LessonDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getVideo(),
                formatter.format(lesson.getCreatedAt()),
                formatter.format(lesson.getUpdatedAt()));
    }

    @Override
    public Lesson toEntity(LessonDto lessonDto) {
        Lesson lesson = new Lesson();
        lesson.setId(lessonDto.id());
        lesson.setTitle(lessonDto.title());
        lesson.setContent(lessonDto.content());
        lesson.setVideo(lessonDto.video());
        return lesson;
    }
}
