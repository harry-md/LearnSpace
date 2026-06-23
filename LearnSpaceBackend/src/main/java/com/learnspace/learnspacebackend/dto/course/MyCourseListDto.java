package com.learnspace.learnspacebackend.dto.course;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;
import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;

import java.math.BigDecimal;

public record MyCourseListDto(
        Integer id,
        String name,
        String image,
        BigDecimal price,
        CategoryDto category,
        SimpleUserDto teacher,
        Long chapterCount,
        Long lessonCount,
        Long completedCount) {}
