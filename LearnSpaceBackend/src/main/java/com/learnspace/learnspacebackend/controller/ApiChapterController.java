package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dto.chapter.ChapterPatchDto;
import com.learnspace.learnspacebackend.service.ChapterService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiChapterController {
    @Autowired
    private ChapterService chapterService;

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
