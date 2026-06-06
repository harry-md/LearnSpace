package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.lesson.LessonDto;
import com.learnspace.learnspacebackend.dto.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.service.LessonService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiLessonController {
    private final LessonService lessonService;

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
        return new ResponseEntity<>(
                lessonService.createLesson(chapterId, lessonDto), HttpStatus.CREATED);
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
