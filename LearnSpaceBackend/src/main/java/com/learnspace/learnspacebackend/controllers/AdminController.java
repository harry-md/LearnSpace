package com.learnspace.learnspacebackend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("admin")
public class AdminController {
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
}
