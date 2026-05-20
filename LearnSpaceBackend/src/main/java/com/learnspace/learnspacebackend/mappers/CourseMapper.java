package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.pojo.Course;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    CourseListDto toListDto(Course course);

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "teacherName", source = "teacher.fullName")
    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    CourseDto toDto(Course course);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Course toEntity(CourseDto dto);
}
