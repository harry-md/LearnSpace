package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.course.CourseListDto;
import com.learnspace.learnspacebackend.dtos.course.CoursePatchDto;

import java.util.List;
import java.util.Map;

public interface CourseService {

    List<CourseDto> getAllCoursesWithDetail(Map<String, String> params);

    List<CourseListDto> getCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourse(int id);

    CourseDto createCourse(CourseDto courseDto);

    CourseDto updateCourse(int id, CoursePatchDto courseDto);

    void deleteCourse(int id);

    List<CourseDto> getEnrolledCourses();
}
