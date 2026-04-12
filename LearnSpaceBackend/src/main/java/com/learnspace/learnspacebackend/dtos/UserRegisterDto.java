package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.NotBlank;

public record UserRegisterDto(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String email) {}
