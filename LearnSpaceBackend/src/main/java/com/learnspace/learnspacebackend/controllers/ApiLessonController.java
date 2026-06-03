package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.lesson.LessonDto;
import com.learnspace.learnspacebackend.dtos.lesson.LessonPatchDto;
import com.learnspace.learnspacebackend.services.LessonService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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
    public ResponseEntity<?> create(
            @PathVariable("chapterId") int chapterId, @Valid @ModelAttribute LessonDto lessonDto) {
        try {
            return new ResponseEntity<>(
                    lessonService.createLesson(chapterId, lessonDto), HttpStatus.CREATED);
        } catch (AccessDeniedException ex) {
            return new ResponseEntity<>(
                    Collections.singletonMap("permission", ex.getMessage()), HttpStatus.FORBIDDEN);
        }
    }

    @PatchMapping(
            value = "/lessons/{id}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<?> update(
            @PathVariable("id") int id, @Valid @ModelAttribute LessonPatchDto lessonDto) {
        try {
            return ResponseEntity.ok(lessonService.updateLesson(id, lessonDto));
        } catch (AccessDeniedException ex) {
            return new ResponseEntity<>(
                    Collections.singletonMap("permission", ex.getMessage()), HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException ex) {
            return new ResponseEntity<>(
                    Collections.singletonMap("permission", ex.getMessage()), HttpStatus.FORBIDDEN);
        }
    }
}
