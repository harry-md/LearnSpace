package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.dtos.CoursePatchDto;
import com.learnspace.learnspacebackend.dtos.TeacherDto;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.User;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    CourseListDto toListDto(Course course);

    @Mapping(target = "category", source = "category")
    @Mapping(target = "teacher", source = "teacher")
    @Mapping(target = "image", source = "image")
    @Mapping(target = "imageFile", ignore = true)
    @Mapping(target = "introVideo", source = "introVideo")
    @Mapping(target = "introVideoFile", ignore = true)
    @Mapping(target = "categoryId", source = "category.id")
    CourseDto toDto(Course course);

    @Mapping(target = "fullName", expression = "java(teacher.getFullName())")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "avatar", source = "avatar")
    TeacherDto toTeacherDto(User teacher);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "introVideo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Course toEntity(CourseDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(@MappingTarget Course course, CoursePatchDto dto);
}
