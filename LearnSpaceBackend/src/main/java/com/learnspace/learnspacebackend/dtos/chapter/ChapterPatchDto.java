package com.learnspace.learnspacebackend.dtos.chapter;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChapterPatchDto(
        @Pattern(regexp = "^[^<>]*$", message = "Tên chương không hợp lệ")
        @Size(min = 1, max = 255, message = "Tên chương không hợp lệ")
        String name,

        String description,

        Boolean free,

        Integer frontChapterId,
        Integer behindChapterId) {}
