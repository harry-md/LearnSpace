package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.course.CourseListDto;
import com.learnspace.learnspacebackend.dtos.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dtos.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
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
    public ResponseEntity<PaginatedResponseDto<CourseListDto>> list(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(courseService.getCourses(params));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDto> retrieve(@PathVariable("courseId") int courseId) {
        return ResponseEntity.ok(courseService.getCourse(courseId));
    }

    @PostMapping(
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<CourseDto> create(@Valid @ModelAttribute CourseDto courseDto) {
        return new ResponseEntity<>(courseService.createCourse(courseDto), HttpStatus.CREATED);
    }

    @PatchMapping(
            value = "/{courseId}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<CourseDto> update(
            @PathVariable("courseId") int courseId,
            @Valid @ModelAttribute CoursePatchDto courseDto) {
        return ResponseEntity.ok(courseService.updateCourse(courseId, courseDto));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> delete(@PathVariable(value = "courseId") int courseId) {
        courseService.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<MyCourseListDto>> getEnrolledCourses() {
        return ResponseEntity.ok(courseService.getEnrolledCourses());
    }
}
