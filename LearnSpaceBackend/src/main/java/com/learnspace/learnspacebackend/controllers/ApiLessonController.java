package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.services.LessonService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiLessonController {
    @Autowired
    private LessonService lessonService;

    @GetMapping("/lessons/{id}")
    public ResponseEntity<LessonDto> retrieve(@PathVariable("id") int lessonId) {
        return ResponseEntity.ok(lessonService.getLesson(lessonId));
    }

    @PostMapping(
            value = "/chapters/{chapterId}/lessons",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<LessonDto> create(
            @PathVariable("chapterId") int chapterId, @Valid @ModelAttribute LessonDto lessonDto) {
        LessonDto created = lessonService.createLesson(chapterId, lessonDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping(
            value = "/lessons/{id}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<LessonDto> update(
            @PathVariable("id") int id, @Valid @ModelAttribute LessonPatchDto lessonDto) {
        return ResponseEntity.ok(lessonService.updateLesson(id, lessonDto));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
