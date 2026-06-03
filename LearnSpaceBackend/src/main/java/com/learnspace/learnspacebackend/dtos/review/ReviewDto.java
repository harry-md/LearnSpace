package com.learnspace.learnspacebackend.dtos.review;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReviewDto(
        @JsonProperty(access = Access.READ_ONLY) SimpleUserDto student,

        @NotNull(message = "Không được để trống điểm đánh giá")
        @Min(value = 1, message = "Comment phải từ 1 đến 5 điểm")
        @Max(value = 5, message = "Comment phải từ 1 đến 5 điểm")
        Integer rating,

        String comment,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt) {}
