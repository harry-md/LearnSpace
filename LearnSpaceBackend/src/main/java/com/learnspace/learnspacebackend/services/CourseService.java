package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.dtos.CoursePatchDto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CourseService {

    List<CourseDto> getAllCoursesWithDetail(Map<String, String> params);

    List<CourseListDto> getCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    CourseDto getCourse(int id);

    CourseDto createCourse(CourseDto courseDto, MultipartFile image, MultipartFile introVideo);

    CourseDto updateCourse(
            int id, CoursePatchDto courseDto, MultipartFile image, MultipartFile introVideo);

    void deleteCourse(int id);
}
