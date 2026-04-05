package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.pojo.Lesson;

public interface LessonMapper {
    LessonDto toDto(Lesson lesson);
}
