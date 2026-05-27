package com.learnspace.learnspacebackend.dtos.lesson;

import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record LessonPatchDto(
        @Size(min = 1, max = 255, message = "Tựa đề bài học không hợp lệ")
        String title,

        @Size(max = 255, message = "Nội dung bài học vượt quá độ dài cho phép")
        String content,

        MultipartFile videoFile,
        Integer frontLessonId,
        Integer behindLessonId) {}
