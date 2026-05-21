package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.services.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Override
    public List<CourseDto> getAllCoursesWithDetail(Map<String, String> params) {
        return courseRepository.getAllCourses(params, true).stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @Override
    public List<CourseListDto> getAllCourses(Map<String, String> params) {
        return courseRepository.getAllCourses(params, false).stream()
                .map(courseMapper::toListDto)
                .toList();
    }

    @Override
    public CourseDto getCourseById(int id) {
        Course course = courseRepository.getCourseById(id);
        if (course == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học");
        }
        return courseMapper.toDto(course);
    }

    @Override
    public Long countCourses(Map<String, String> params) {
        return courseRepository.countCourses(params);
    }

    @Override
    public void deleteCourse(int id) {
        courseRepository.deleteCourse(id);
    }

    @Override
    public CourseDto createOrUpdate(CourseDto course) {
        throw new UnsupportedOperationException("Unimplemented method 'createOrUpdate'");
    }
}
