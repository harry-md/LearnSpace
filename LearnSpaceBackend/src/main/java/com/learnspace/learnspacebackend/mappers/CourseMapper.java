package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.pojo.Course;

public interface CourseMapper {
    CourseDto toDto(Course c);

    Course toEntity(CourseDto dto);
}
