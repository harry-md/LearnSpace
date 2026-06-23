package com.learnspace.learnspacebackend.repository;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface CourseRepositoryCustom {
    List<Object[]> getCoursesWithStats(Map<String, String> params, Pageable pageable);

    List<Object[]> getEnrolledCoursesByStudentId(int studentId);
}
