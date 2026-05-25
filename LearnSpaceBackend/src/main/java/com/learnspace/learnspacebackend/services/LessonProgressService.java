package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.LessonProgressDto;

public interface LessonProgressService {

    LessonProgressDto getLessonProgress(int courseId);
}
