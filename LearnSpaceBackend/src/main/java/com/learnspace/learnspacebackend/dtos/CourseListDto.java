package com.learnspace.learnspacebackend.dtos;

import java.math.BigDecimal;

public record CourseListDto(
        Integer id, String name, String image, BigDecimal price, Boolean active) {}
