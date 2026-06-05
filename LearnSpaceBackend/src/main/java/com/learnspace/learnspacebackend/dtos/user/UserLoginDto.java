package com.learnspace.learnspacebackend.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserLoginDto(
        @NotBlank @Size(max = 255) String username,

        @NotBlank @Size(max = 255) String password) {}
