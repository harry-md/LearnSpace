package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
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
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt) {}
