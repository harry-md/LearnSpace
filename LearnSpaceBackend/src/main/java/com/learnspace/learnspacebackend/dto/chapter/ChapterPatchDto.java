package com.learnspace.learnspacebackend.dto.chapter;

import jakarta.validation.constraints.Size;

public record ChapterPatchDto(
        @Size(min = 1, max = 255) String name,

        @Size(max = 15000) String description,

        Boolean free) {}
