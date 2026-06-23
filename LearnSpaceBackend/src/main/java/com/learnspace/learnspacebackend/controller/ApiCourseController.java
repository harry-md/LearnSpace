package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.course.CourseDto;
import com.learnspace.learnspacebackend.dto.course.CourseListDto;
import com.learnspace.learnspacebackend.dto.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dto.course.MyCourseListDto;
import com.learnspace.learnspacebackend.service.CourseService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/courses")
public class ApiCourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<CourseListDto>> list(@RequestParam Map<String, String> params) {
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
    public ResponseEntity<CourseDto> create(@Valid @ModelAttribute CourseDto courseDto)
            throws IOException {
        return new ResponseEntity<>(courseService.createCourse(courseDto), HttpStatus.CREATED);
    }

    @PatchMapping(
            value = "/{courseId}",
            consumes = {
                MediaType.MULTIPART_FORM_DATA_VALUE,
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            })
    public ResponseEntity<CourseDto> update(
            @PathVariable("courseId") int courseId, @Valid @ModelAttribute CoursePatchDto courseDto)
            throws IOException {
        return ResponseEntity.ok(courseService.updateCourse(courseId, courseDto));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> delete(@PathVariable("courseId") int courseId) throws IOException {
        courseService.deleteCourse(courseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<MyCourseListDto>> getEnrolledCourses() {
        return ResponseEntity.ok(courseService.getEnrolledCourses());
    }
}
