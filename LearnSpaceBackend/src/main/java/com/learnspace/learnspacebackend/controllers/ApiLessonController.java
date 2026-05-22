package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.services.LessonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
public class ApiLessonController {
    @Autowired
    private LessonService lessonService;
}
