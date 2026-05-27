package com.learnspace.learnspacebackend.dtos.course;

import java.math.BigDecimal;

public record CourseListDto(
        Integer id, String name, String image, BigDecimal price, boolean active) {}
