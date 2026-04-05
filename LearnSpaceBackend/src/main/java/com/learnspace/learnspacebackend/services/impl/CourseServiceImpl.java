package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
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
    public List<CourseDto> getAllCourses(Map<String, String> params) {
        return courseRepository.getAllCourses(params).stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @Override
    public CourseDto getCourseById(int id) {
        return courseMapper.toDto(courseRepository.getCourseById(id));
    }

    //    @Override
    //    public CourseDto createOrUpdate(Course course) {
    //        return courseMapper.toDto(courseRepository.createOrUpdate(course));
    //    }

    @Override
    public void deleteCourse(int id) {
        courseRepository.deleteCourse(id);
    }
}
