package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDto(
        @NotBlank String username, @NotBlank String password) {}
