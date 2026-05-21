package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.services.CourseService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<CourseListDto>> list(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(courseService.getAllCourses(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> retrieve(@PathVariable("id") int id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping
    public ResponseEntity<CourseDto> create(@Valid @RequestBody CourseDto courseDto) {
        CourseDto savedCourse = courseService.create(courseDto);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDto> update(
            @PathVariable(value = "id") int id, @Valid @RequestBody CourseDto courseDto) {
        CourseDto updatedCourse = courseService.update(id, courseDto);
        return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") int id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
