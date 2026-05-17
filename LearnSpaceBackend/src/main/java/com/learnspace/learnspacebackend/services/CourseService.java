package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.CourseDto;

import java.util.List;
import java.util.Map;

public interface CourseService {

    List<CourseDto> getAllCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourseById(int id);

    //    CourseDto createOrUpdate(CourseDto course);

    void deleteCourse(int id);
}
