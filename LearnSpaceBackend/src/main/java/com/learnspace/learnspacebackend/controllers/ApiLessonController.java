package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.services.ChapterService;
import com.learnspace.learnspacebackend.services.LessonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class ApiLessonController {
    @Autowired
    private LessonService lessonService;

    @Autowired
    private ChapterService chapterService;

    @GetMapping("/chapters/{chapterId}/lessons")
    public ResponseEntity<List<LessonDto>> getLessons(@PathVariable("chapterId") int chapterId) {
        ChapterDto chapter = chapterService.getChapterById(chapterId);
        if (chapter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lessonService.getLessons(chapter.id()));
    }

    @PostMapping(
            value = "/chapters/{chapterId}/lessons",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LessonDto> addOrUpdateLesson(
            @PathVariable("chapterId") int chapterId,
            @RequestParam Map<String, String> lesson,
            @RequestParam(value = "video") MultipartFile video) {
        LessonDto createLesson = lessonService.addOrUpdateLesson(chapterId, lesson, video);
        return new ResponseEntity<>(createLesson, HttpStatus.CREATED);
    }
}
