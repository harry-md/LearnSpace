package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.services.CategoryService;
import com.learnspace.learnspacebackend.services.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class CourseController {
    @Autowired
    private Environment env;

    @Autowired
    private CourseService courseService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/courses")
    public String course(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("categories", categoryService.getCategories());
        model.addAttribute("courses", courseService.getCourses(params));

        int pageSize = env.getProperty("course.page_size", Integer.class);
        long totalCourse = courseService.countCourses(params);
        int totalPages = (int) Math.ceil((double) totalCourse / pageSize);
        int currentPage = 1;
        if (params != null && params.containsKey("page")) {
            currentPage = Integer.parseInt(params.get("page"));
        }

        model.addAttribute("totalPages", totalPages);
        model.addAttribute("currentPage", currentPage);
        return "admin_courses";
    }
}
