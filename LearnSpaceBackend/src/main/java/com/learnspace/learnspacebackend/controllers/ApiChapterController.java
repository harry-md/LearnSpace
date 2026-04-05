package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.services.ChapterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
