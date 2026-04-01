package com.learnspace.learnspacebackend.services.impl;

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

    @Override
    public List<Course> getAllCourses(Map<String, String> params) {
        return courseRepository.getAllCourses(params);
    }

    @Override
    public Course getCourseById(int id) {
        return courseRepository.getCourseById(id);
    }

    @Override
    public Course createOrUpdate(Course course) {
        return courseRepository.createOrUpdate(course);
    }

    @Override
    public void deleteCourse(int id) {
        courseRepository.deleteCourse(id);
    }
}
