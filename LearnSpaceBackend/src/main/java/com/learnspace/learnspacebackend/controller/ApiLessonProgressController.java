package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.service.LessonProgressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiLessonProgressController {
    @Autowired
    private LessonProgressService lessonProgressService;

    @PostMapping("/lessons/{lessonId}/lesson-progress")
    public ResponseEntity<LessonProgressDto> create(
            @PathVariable("lessonId") int lessonId,
            @RequestBody LessonProgressDto lessonProgressDto) {
        return new ResponseEntity<>(
                lessonProgressService.saveLessonProgress(lessonId, lessonProgressDto),
                HttpStatus.CREATED);
    }
}
