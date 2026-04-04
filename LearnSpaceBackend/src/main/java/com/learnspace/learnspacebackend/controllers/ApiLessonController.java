package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.ChapterDto;
import com.learnspace.learnspacebackend.dtos.LessonDto;
import com.learnspace.learnspacebackend.services.ChapterService;
import com.learnspace.learnspacebackend.services.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/api/chapters/{chapterId}/lessons")
public class ApiLessonController {
    @Autowired
    private LessonService lessonService;

    @Autowired
    private ChapterService chapterService;

    @GetMapping
    public ResponseEntity<List<LessonDto>> getLessons(
            @RequestParam(name = "courseId", required = true) int courseId, @PathVariable int chapterId) {
        ChapterDto chapter = chapterService.getChapterById(chapterId);
        if (chapter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lessonService.getLessons(chapter.id()));
    }
}
