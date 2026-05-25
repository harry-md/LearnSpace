package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EnrollmentDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String studentName,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String courseName,

        @NotNull Integer courseId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        EnrollmentStatus status,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime createdAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime updatedAt) {}
