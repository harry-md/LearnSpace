package com.learnspace.learnspacebackend.dto.enrollment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EnrollmentDto(
        @NotNull @JsonProperty(access = Access.WRITE_ONLY) Integer courseId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        EnrollmentStatus status,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt) {}
