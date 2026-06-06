package com.learnspace.learnspacebackend.dto.progress;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record LessonProgressDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer lessonId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String lessonTitle,

        @NotNull @PositiveOrZero Integer watchedSec,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Boolean completed,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt) {}
