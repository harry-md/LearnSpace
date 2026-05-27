package com.learnspace.learnspacebackend.dtos.chapter;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record ChapterDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        @NotBlank(message = "Tên chương không được để trống")
        @Pattern(regexp = "^[^<>]*$", message = "Tên chương không hợp lệ")
        @Size(max = 255, message = "Tên chương vượt quá độ dài cho phép")
        String name,

        @JsonProperty(access = Access.READ_ONLY) Integer order,

        Boolean free,

        @JsonProperty(access = Access.READ_ONLY) Integer order,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt) {}
