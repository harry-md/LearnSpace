package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.pojo.Course;

import java.util.List;
import java.util.Map;

public interface CourseService {
    List<Course> getAllCourses(Map<String, String> params);

    Course getCourseById(int id);

    Course createOrUpdate(Course course);

    void deleteCourse(int id);
}
