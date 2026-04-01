package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("admin")
public class AdminController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping()
    public String admin() {
        return "admin";
    }

    @GetMapping("/users")
    public String adminUser() {
        return "admin_user";
    }

    @GetMapping("/courses")
    public String adminCourse() {
        return "admin_courses";
    }

    @GetMapping("/enrollments")
    public String adminEnrollment() {
        return "admin_enrollments";
    }

    @GetMapping("/payments")
    public String adminPayment() {
        return "admin_payments";
    }

    @GetMapping("/categories")
    public String adminCategory(Model model) {
        model.addAttribute("categories", categoryService.getCates());
        model.addAttribute("category", new Category());
        return "admin_categories";
    }
}
