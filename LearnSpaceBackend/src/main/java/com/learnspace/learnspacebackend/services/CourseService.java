package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;

import java.util.List;
import java.util.Map;

public interface CourseService {

    List<CourseDto> getAllCoursesWithDetail(Map<String, String> params);

    List<CourseListDto> getAllCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourseById(int id);

    CourseDto createOrUpdate(CourseDto course);

    void deleteCourse(int id);
}
