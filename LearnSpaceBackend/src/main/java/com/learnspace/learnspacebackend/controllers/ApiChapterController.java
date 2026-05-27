package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dtos.chapter.ChapterPatchDto;
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
        return ResponseEntity.ok(chapterService.getChapter(chapterId));
    }

    @PostMapping("/courses/{courseId}/chapters")
    public ResponseEntity<ChapterDto> create(
            @PathVariable("courseId") int courseId, @Valid @RequestBody ChapterDto chapterDto) {
        ChapterDto createdChapter = chapterService.createChapter(courseId, chapterDto);
        return new ResponseEntity<>(createdChapter, HttpStatus.CREATED);
    }

    @PatchMapping("/chapters/{id}")
    public ResponseEntity<ChapterDto> update(
            @PathVariable("id") int id, @Valid @RequestBody ChapterPatchDto chapterDto) {
        ChapterDto updatedChapter = chapterService.updateChapter(id, chapterDto);
        return ResponseEntity.ok(updatedChapter);
    }

    @DeleteMapping("/chapters/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }
}
