package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.services.LessonProgressService;

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
                lessonProgressService.addLessonProgress(lessonId, lessonProgressDto),
                HttpStatus.CREATED);
    }

    @PatchMapping("/lessons/{lessonId}/lesson-progress")
    public ResponseEntity<LessonProgressDto> update(
            @PathVariable("lessonId") int lessonId,
            @RequestBody LessonProgressDto lessonProgressDto) {
        return new ResponseEntity<>(
                lessonProgressService.updateLessonProgress(lessonId, lessonProgressDto),
                HttpStatus.OK);
    }
}
