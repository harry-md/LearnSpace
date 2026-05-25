package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonProgressDto;
import com.learnspace.learnspacebackend.pojo.LessonProgress;

public interface LessonProgressService {

    LessonProgressDto getLessonProgress(int courseId);

    LessonProgressDto addLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);
}
