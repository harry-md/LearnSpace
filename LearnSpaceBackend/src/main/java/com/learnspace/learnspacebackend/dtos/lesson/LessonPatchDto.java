package com.learnspace.learnspacebackend.dtos.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record LessonPatchDto(
        @Size(min = 1, max = 255) String title,

        @Size(max = 255) String content,

        @JsonIgnore MultipartFile videoFile) {}
