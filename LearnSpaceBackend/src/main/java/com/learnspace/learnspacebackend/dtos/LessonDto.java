package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LessonDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        @NotBlank(message = "Tựa đề bài học không được để trống")
        @Size(max = 255, message = "Tựa đề bài học vượt quá độ dài cho phép")
        String title,

        @Size(max = 255, message = "Nội dung bài học vượt quá độ dài cho phép")
        String content,

        @Min(value = 1, message = "Thứ tự bài học không hợp lệ")
        Integer order,

        @JsonProperty(access = Access.READ_ONLY) String video,

        @JsonProperty(access = Access.READ_ONLY) Integer videoLength,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String createdAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String updatedAt) {}
