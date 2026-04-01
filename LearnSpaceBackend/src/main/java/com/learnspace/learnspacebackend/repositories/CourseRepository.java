package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Course;

import java.util.List;
import java.util.Map;

public interface CourseRepository {
    List<Course> getAllCourses(Map<String, String> params);

    Course getCourseById(int id);

    void createOrUpdate(Course course);

    void deleteCourse(int id);
}
