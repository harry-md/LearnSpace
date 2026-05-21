package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChapterPatchDto(
        @Pattern(regexp = "^[^<>]*$", message = "Tên chương không hợp lệ")
        @Size(min = 1, max = 255, message = "Tên chương không hợp lệ")
        String name,

        @Min(value = 0, message = "Số thứ tự của chương không hợp lệ")
        Integer order,

        Boolean free) {}
