package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.LessonDto;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/chapters")
public class ApiLessonController {
    @GetMapping
    public List<LessonDto> getLessons() {
        return "lessons";
    }
}
