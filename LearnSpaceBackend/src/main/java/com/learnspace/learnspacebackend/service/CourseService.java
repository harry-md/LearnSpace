package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.course.CourseDto;
import com.learnspace.learnspacebackend.dto.course.CourseListDto;
import com.learnspace.learnspacebackend.dto.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dto.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dto.pagination.PaginatedResponseDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CourseService {
    PaginatedResponseDto<CourseListDto> getCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourse(int id);

    CourseDto createCourse(CourseDto courseDto) throws IOException;

    CourseDto updateCourse(int id, CoursePatchDto courseDto) throws IOException;

    void deleteCourse(int id) throws IOException;

    List<MyCourseListDto> getEnrolledCourses();
}
