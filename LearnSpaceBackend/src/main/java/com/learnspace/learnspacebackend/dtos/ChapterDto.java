package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChapterDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        @NotBlank(message = "Tên chương không được để trống")
        @Pattern(regexp = "^[^<>]*$", message = "Tên chương không hợp lệ")
        @Size(max = 255, message = "Tên chương vượt quá độ dài cho phép")
        String name,

        @Min(value = 0, message = "Số thứ tự của chương không hợp lệ")
        Integer order,

        Boolean free,

        @JsonProperty(access = Access.READ_ONLY) String createdAt,
        @JsonProperty(access = Access.READ_ONLY) String updatedAt) {}
