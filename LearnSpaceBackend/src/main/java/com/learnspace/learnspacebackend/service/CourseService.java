package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.course.CourseDto;
import com.learnspace.learnspacebackend.dto.course.CourseListDto;
import com.learnspace.learnspacebackend.dto.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dto.course.MyCourseListDto;

import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CourseService {
    Page<CourseListDto> getCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourse(int id);

    CourseDto createCourse(CourseDto courseDto) throws IOException;

    CourseDto updateCourse(int id, CoursePatchDto courseDto) throws IOException;

    void deleteCourse(int id) throws IOException;

    List<MyCourseListDto> getEnrolledCourses();
}
