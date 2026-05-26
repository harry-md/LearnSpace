package com.learnspace.learnspacebackend.dtos;

import com.drew.lang.annotations.NotNull;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CategoryDto(
        @NotNull @Positive(message = "Id danh mục không hợp lệ")
        Integer id,

        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(max = 255, message = "Tên danh mục không được vượt quá số ký tự cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Tên danh mục không hợp lệ")
        String name) {}
