package com.learnspace.learnspacebackend.dtos.course;

import com.learnspace.learnspacebackend.dtos.category.CategoryDto;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;

import java.math.BigDecimal;

public record CourseListDto(
        Integer id,
        String name,
        String image,
        BigDecimal price,
        CategoryDto category,
        SimpleUserDto teacher,
        Double avgRating,
        Long enrollmentCount) {}
