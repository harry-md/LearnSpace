package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.dtos.CoursePatchDto;
import com.learnspace.learnspacebackend.services.CourseService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
        return ResponseEntity.ok(courseService.getCourses(params));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> retrieve(@PathVariable("id") int id) {
        return ResponseEntity.ok(courseService.getCourse(id));
    }

    @PostMapping(
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<CourseDto> create(@Valid @ModelAttribute CourseDto courseDto) {
        CourseDto saved = courseService.createCourse(courseDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping(
            value = "/{id}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<CourseDto> update(
            @PathVariable("id") int id, @Valid @ModelAttribute CoursePatchDto courseDto) {
        CourseDto updated = courseService.updateCourse(id, courseDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") int id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
