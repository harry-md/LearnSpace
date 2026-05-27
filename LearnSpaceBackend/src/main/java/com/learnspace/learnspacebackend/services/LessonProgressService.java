package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.progress.CourseProgressDto;
import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;

public interface LessonProgressService {

    LessonProgressDto getLessonProgress(int courseId);

    LessonProgressDto addLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);

    LessonProgressDto updateLessonProgress(int lessonId, LessonProgressDto lessonProgressDto);

    CourseProgressDto getCourseProgress(int courseId);
}
