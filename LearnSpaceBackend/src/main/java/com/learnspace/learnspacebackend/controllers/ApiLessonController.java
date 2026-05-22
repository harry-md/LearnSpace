package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiLessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    private Map<String, Object> mapToResponse(Lesson lesson) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", lesson.getId());
        map.put("title", lesson.getTitle());
        map.put("order", lesson.getOrder());
        map.put("videoLength", lesson.getVideoLength());
        
        // Parse content: format is type|duration|isFree
        String content = lesson.getContent();
        String type = "video";
        String duration = "10:00";
        boolean isFree = false;
        
        if (content != null && content.contains("|")) {
            String[] parts = content.split("\\|");
            if (parts.length > 0) type = parts[0];
            if (parts.length > 1) duration = parts[1];
            if (parts.length > 2) isFree = Boolean.parseBoolean(parts[2]);
        }
        
        map.put("type", type);
        map.put("duration", duration);
        map.put("isFree", isFree);
        return map;
    }

    private int parseDurationToSeconds(String duration) {
        if (duration == null || duration.trim().isEmpty()) {
            return 600; // default 10 minutes
        }
        try {
            if (duration.contains(":")) {
                String[] parts = duration.split(":");
                int min = Integer.parseInt(parts[0]);
                int sec = Integer.parseInt(parts[1]);
                return min * 60 + sec;
            } else {
                return Integer.parseInt(duration) * 60; // assume minutes if just a number
            }
        } catch (Exception e) {
            return 600;
        }
    }

    @GetMapping("/chapters/{chapterId}/lessons")
    public ResponseEntity<List<Map<String, Object>>> list(@PathVariable("chapterId") int chapterId) {
        List<Lesson> lessons = lessonRepository.getLessons(chapterId);
        List<Map<String, Object>> response = new ArrayList<>();
        for (Lesson l : lessons) {
            response.add(mapToResponse(l));
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chapters/{chapterId}/lessons")
    public ResponseEntity<Map<String, Object>> create(
            @PathVariable("chapterId") int chapterId, @RequestBody Map<String, Object> body) {
        Chapter chapter = chapterRepository.getChapterById(chapterId);
        if (chapter == null) {
            return ResponseEntity.notFound().build();
        }
        
        Lesson lesson = new Lesson();
        lesson.setChapter(chapter);
        lesson.setTitle((String) body.getOrDefault("title", "Bài học mới"));
        
        String type = (String) body.getOrDefault("type", "video");
        String duration = (String) body.getOrDefault("duration", "10:00");
        boolean isFree = false;
        if (body.get("isFree") instanceof Boolean) {
            isFree = (Boolean) body.get("isFree");
        }
        
        lesson.setContent(type + "|" + duration + "|" + isFree);
        lesson.setVideo("https://example.com/mock-video.mp4");
        lesson.setVideoLength(parseDurationToSeconds(duration));
        
        // Count existing lessons to set order
        List<Lesson> existing = lessonRepository.getLessons(chapterId);
        lesson.setOrder(existing.size() + 1);
        
        Lesson saved = lessonRepository.addOrUpdateLesson(lesson);
        return new ResponseEntity<>(mapToResponse(saved), HttpStatus.CREATED);
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable("id") int id, @RequestBody Map<String, Object> body) {
        Lesson lesson = lessonRepository.getLessonById(id);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (body.containsKey("title")) {
            lesson.setTitle((String) body.get("title"));
        }
        
        // Read current fields from content to preserve unchanged ones
        String content = lesson.getContent();
        String type = "video";
        String duration = "10:00";
        boolean isFree = false;
        if (content != null && content.contains("|")) {
            String[] parts = content.split("\\|");
            if (parts.length > 0) type = parts[0];
            if (parts.length > 1) duration = parts[1];
            if (parts.length > 2) isFree = Boolean.parseBoolean(parts[2]);
        }
        
        if (body.containsKey("type")) {
            type = (String) body.get("type");
        }
        if (body.containsKey("duration")) {
            duration = (String) body.get("duration");
            lesson.setVideoLength(parseDurationToSeconds(duration));
        }
        if (body.containsKey("isFree")) {
            if (body.get("isFree") instanceof Boolean) {
                isFree = (Boolean) body.get("isFree");
            }
        }
        
        lesson.setContent(type + "|" + duration + "|" + isFree);
        
        if (body.containsKey("order")) {
            lesson.setOrder((Integer) body.get("order"));
        }
        
        Lesson saved = lessonRepository.addOrUpdateLesson(lesson);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        Lesson lesson = lessonRepository.getLessonById(id);
        if (lesson == null) {
            return ResponseEntity.notFound().build();
        }
        lessonRepository.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
