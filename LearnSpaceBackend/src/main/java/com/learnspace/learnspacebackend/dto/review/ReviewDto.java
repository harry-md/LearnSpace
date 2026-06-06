package com.learnspace.learnspacebackend.dto.review;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReviewDto(
        @JsonProperty(access = Access.READ_ONLY) SimpleUserDto student,

        @NotNull @Min(value = 1) @Max(value = 5) Integer rating,

        String comment,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt) {}
