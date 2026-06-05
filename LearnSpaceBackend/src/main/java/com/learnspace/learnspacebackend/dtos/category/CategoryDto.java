package com.learnspace.learnspacebackend.dtos.category;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.*;

public record CategoryDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        @NotBlank @Size(max = 255) String name) {}
