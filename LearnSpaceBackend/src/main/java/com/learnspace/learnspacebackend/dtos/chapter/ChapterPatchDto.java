package com.learnspace.learnspacebackend.dtos.chapter;

import com.learnspace.learnspacebackend.utils.NotHtml;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChapterPatchDto(
        @Pattern(regexp = "^[^<>]*$", message = "Tên chương không hợp lệ")
        @Size(min = 1, max = 255, message = "Tên chương không hợp lệ")
        String name,

        @Size(max = 15000, message = "Mô tả chương vượt quá độ dài cho phép") @NotHtml
        String description,

        Boolean free,

        Integer frontChapterId,
        Integer behindChapterId) {}
