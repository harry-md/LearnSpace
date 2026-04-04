package com.learnspace.learnspacebackend.dtos;

public record LessonDto(
        Integer id, String title, String content, String video, String createdAt, String updatedAt) {}
