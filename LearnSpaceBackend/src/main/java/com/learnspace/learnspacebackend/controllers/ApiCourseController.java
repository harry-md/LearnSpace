package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.services.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class ApiCourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getCourses(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(courseService.getAllCourses(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable("id") int id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(Course course) {
        Course savedCourse = courseService.createOrUpdate(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }
}
