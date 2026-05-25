package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record LessonProgressDto(
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) @PositiveOrZero
        Integer lessonId,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) @PositiveOrZero
        Integer enrollmentId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String lessonName,

        @PositiveOrZero Integer watchedSec,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Boolean completed,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime updatedAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime createdAt) {}
