package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.service.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.Year;

@RequiredArgsConstructor
@Controller
public class AdminController {
    private final UserService userService;
    private final CourseService courseService;
    private final StatsService statsService;

    @GetMapping()
    public String admin(Model model, @RequestParam(value = "year", required = false) Integer year) {
        model.addAttribute("totalUsers", userService.count());
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
