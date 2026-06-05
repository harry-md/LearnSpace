package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.services.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.Year;

@Controller
@RequestMapping
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private StatsService statsService;

    @GetMapping()
    public String admin(Model model, @RequestParam(value = "year", required = false) Integer year) {
        model.addAttribute("totalUsers", userService.countAllUsers());
        model.addAttribute("totalCourses", courseService.countCourses(null));
        model.addAttribute("totalIncome", statsService.getTotalIncome());

        int targetYear = (year != null) ? year : Year.now().getValue();

        model.addAttribute("monthlyIncome", statsService.getIncomeByAllMonths(targetYear));
        model.addAttribute("quarterlyIncome", statsService.getIncomeByAllQuarter(targetYear));

        model.addAttribute("selectedYear", targetYear);

        model.addAttribute("enrollmentStats", statsService.statsEnrollmentByCourse());
        return "admin";
    }
}
