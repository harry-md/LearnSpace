package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.NotBlank;

public record LessonDto(
        Integer id,
        @NotBlank String title,
        String content,
        @NotBlank String video,
        @NotBlank Integer order,
        Integer videoLength,
        String createdAt,
        String updatedAt) {}
