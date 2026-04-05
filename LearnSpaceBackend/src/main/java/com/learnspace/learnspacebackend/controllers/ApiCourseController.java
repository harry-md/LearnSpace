package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.services.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class ApiCourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDto>> getCourses(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(courseService.getAllCourses(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable("id") int id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    //    @PostMapping
    //    public ResponseEntity<Course> createCourse(Course course) {
    //        Course savedCourse = courseService.createOrUpdate(course);
    //        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    //    }
}
