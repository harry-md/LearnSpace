package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.dtos.LessonListDto;
import com.learnspace.learnspacebackend.dtos.LessonPatchDto;
import com.learnspace.learnspacebackend.services.LessonService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiLessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/chapters/{chapterId}/lessons")
    public ResponseEntity<List<LessonListDto>> list(@PathVariable("chapterId") int chapterId) {
        return ResponseEntity.ok(lessonService.getLessons(chapterId));
    }

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
            @PathVariable("chapterId") int chapterId,
            @Valid @RequestPart("data") LessonDto lessonDto,
            @RequestPart("video") MultipartFile video) {
        LessonDto created = lessonService.createLesson(chapterId, lessonDto, video);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping(
            value = "/lessons/{id}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<LessonDto> update(
            @PathVariable("id") int id,
            @Valid @RequestPart(value = "data", required = false) LessonPatchDto lessonDto,
            @RequestPart(value = "video", required = false) MultipartFile video) {
        return ResponseEntity.ok(lessonService.updateLesson(id, lessonDto, video));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
