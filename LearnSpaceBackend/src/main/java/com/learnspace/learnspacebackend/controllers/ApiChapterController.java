package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.services.ChapterService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiChapterController {

    @Autowired
    private ChapterService chapterService;

    @GetMapping("/courses/{courseId}/chapters")
    public ResponseEntity<List<ChapterDto>> list(@PathVariable("courseId") int courseId) {
        List<ChapterDto> chapters = chapterService.getChapters(courseId);
        return ResponseEntity.ok(chapters);
    }

    @GetMapping("/chapters/{id}")
    public ResponseEntity<ChapterDto> retrieve(@PathVariable("id") int chapterId) {
        return ResponseEntity.ok(chapterService.getChapterById(chapterId));
    }

    @PostMapping("/courses/{courseId}/chapters")
    public ResponseEntity<?> create(
            @PathVariable("courseId") int courseId, @Valid @RequestBody ChapterDto chapter) {
        try {
            ChapterDto createdChapter = chapterService.createOrUpdate(courseId, chapter);
            return new ResponseEntity<>(createdChapter, HttpStatus.CREATED);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
