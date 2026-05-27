package com.learnspace.learnspacebackend.dtos.lesson;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public record LessonDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        @NotBlank(message = "Tựa đề bài học không được để trống")
        @Size(max = 255, message = "Tựa đề bài học vượt quá độ dài cho phép")
        String title,

        @Size(max = 255, message = "Nội dung bài học vượt quá độ dài cho phép")
        String content,

        @JsonProperty(access = Access.READ_ONLY) String video,
        @JsonProperty(access = Access.READ_ONLY) Integer videoLength,
        @JsonProperty(access = Access.READ_ONLY) Integer order,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        @JsonIgnore MultipartFile videoFile) {}
