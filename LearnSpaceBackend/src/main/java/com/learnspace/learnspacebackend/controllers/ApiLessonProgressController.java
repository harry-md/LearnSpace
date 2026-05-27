package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.progress.CourseProgressDto;
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

    @GetMapping("/lessons/{lessonId}/lesson-progress")
    public ResponseEntity<LessonProgressDto> retrieve(@PathVariable("lessonId") int lessonId) {
        return ResponseEntity.ok(lessonProgressService.getLessonProgress(lessonId));
    }

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

    @GetMapping("/courses/{courseId}/progress")
    public ResponseEntity<CourseProgressDto> getCourseProgress(
            @PathVariable("courseId") int courseId) {
        return ResponseEntity.ok(lessonProgressService.getCourseProgress(courseId));
    }
}
