package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.course.CourseListDto;
import com.learnspace.learnspacebackend.dtos.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dtos.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;

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
