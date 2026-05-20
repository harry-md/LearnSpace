package com.learnspace.learnspacebackend.dtos;

import java.math.BigDecimal;

public record CourseDto(
        Integer id,
        String name,
        String description,
        String image,
        String introVideo,
        BigDecimal price,
        String categoryName,
        String teacherName,
        Boolean active,
        String createdAt,
        String updatedAt) {}
