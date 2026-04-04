package com.learnspace.learnspacebackend.dtos;

import java.time.LocalDateTime;

public record LessonDto(
        Integer id, String title, String content, String video, LocalDateTime createdAt, LocalDateTime updatedAt) {}
