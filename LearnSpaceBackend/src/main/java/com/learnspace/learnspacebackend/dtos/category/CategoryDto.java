package com.learnspace.learnspacebackend.dtos.category;

import jakarta.validation.constraints.*;

public record CategoryDto(
        @NotNull @Positive Integer id,

        @NotBlank @Size(max = 255) String name) {}
