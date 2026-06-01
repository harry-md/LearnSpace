package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.services.CategoryService;
import com.learnspace.learnspacebackend.services.CourseService;
import com.learnspace.learnspacebackend.services.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
@RequestMapping
public class AdminController {

    @Autowired
    private Environment env;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CourseService courseService;

    @GetMapping()
    public String admin() {
        return "admin";
    }

    @GetMapping("/users")
    public String user(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("users", userService.getAllUsers(params));
        return "admin_user";
    }

    @PostMapping("/users/update")
    public String updateUser(@Valid @ModelAttribute("userDto") AdminUserUpdateDto dto) {
        userService.updateByAdmin(dto);
        return "redirect:/users";
    }

    @GetMapping("/courses")
    public String course(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("categories", categoryService.getCategories());
        model.addAttribute("courses", courseService.getCourses(params));

        int pageSize = env.getProperty("course.pageSize", Integer.class);
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

    @GetMapping("/enrollments")
    public String enrollment(Model model) {
        model.addAttribute("enrollments", courseService.getEnrolledCourses());
        return "admin_enrollments";
    }

    @GetMapping("/payments")
    public String payment() {
        return "admin_payments";
    }
}
