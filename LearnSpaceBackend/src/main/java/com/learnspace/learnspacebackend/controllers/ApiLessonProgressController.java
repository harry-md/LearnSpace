package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.LessonProgressDto;
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

    @GetMapping("/lesson-progress/{progressId}")
    public ResponseEntity<LessonProgressDto> retrieve(@PathVariable("progressId") int progressId) {
        return ResponseEntity.ok(lessonProgressService.getLessonProgress(progressId));
    }

    @PostMapping("/lessons/{lessonId}/lesson-progress")
    public ResponseEntity<LessonProgressDto> create(
            @PathVariable("lessonId") int lessonId, @RequestBody LessonProgressDto lessonProgressDto) {
        return new ResponseEntity<>(
                lessonProgressService.addLessonProgress(lessonId, lessonProgressDto), HttpStatus.CREATED);
    }
}
