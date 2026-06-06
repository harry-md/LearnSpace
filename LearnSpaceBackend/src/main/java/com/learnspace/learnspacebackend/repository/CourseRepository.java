package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Course;

import java.util.List;
import java.util.Map;

public interface CourseRepository {
    List<Object[]> getAllCourses(Map<String, String> params);

    Long countCourses(Map<String, String> params);

    Course getCourseById(int courseId);

    Course addOrUpdateCourse(Course course);

    void deleteCourse(int courseId);

    List<Object[]> getEnrolledCoursesByStudent(int studentId);
}
