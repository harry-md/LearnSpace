package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.services.ChapterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/chapters")
public class ApiChapterController {
    @Autowired
    private ChapterService chapterService;

    @GetMapping("{id}")
    public ResponseEntity<ChapterDto> getChapterById(@PathVariable("id") int chapterId) {
        return ResponseEntity.ok(chapterService.getChapterById(chapterId));
    }

    @GetMapping
    public ResponseEntity<List<ChapterDto>> getAllChapters(@PathVariable("courseId") int courseId) {

        List<ChapterDto> chapters = chapterService.getChapters(courseId);
        return ResponseEntity.ok(chapters);
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateChapter(
            @PathVariable("courseId") int courseId, @RequestBody ChapterDto chapter) {
        try {
            ChapterDto createdChapter = chapterService.createOrUpdate(courseId, chapter);
            return new ResponseEntity<>(createdChapter, HttpStatus.CREATED);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
