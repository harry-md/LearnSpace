package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.Size;

public record LessonPatchDto(
        @Size(min = 1, max = 255, message = "Tựa đề bài học không hợp lệ")
        String title,

        @Size(max = 255, message = "Nội dung bài học vượt quá độ dài cho phép")
        String content) {}
