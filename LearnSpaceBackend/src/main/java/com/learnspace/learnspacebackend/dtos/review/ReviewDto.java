package com.learnspace.learnspacebackend.dtos.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;
import com.learnspace.learnspacebackend.utils.NotHtml;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ReviewDto(
        @JsonProperty(access = Access.READ_ONLY) SimpleUserDto student,

        @NotNull(message = "Không được để trống điểm đánh giá") @Min(value = 1) @Max(value = 5)
        Integer rating,

        @NotHtml String comment,
        LocalDateTime createdAt) {}
