package com.learnspace.learnspacebackend.dtos;

import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserProfileDto(
        Integer id,
        @NotBlank String username,
        @NotBlank UserRole role,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String email,
        String avatar,
        @NotNull boolean active,
        boolean verified,
        String createdAt,
        String updatedAt) {}
