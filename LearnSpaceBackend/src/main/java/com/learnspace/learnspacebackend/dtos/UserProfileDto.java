package com.learnspace.learnspacebackend.dtos;

import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.NotBlank;

public record UserProfileDto(
        @NotBlank String username,
        UserRole role,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String email,
        String avatar,
        Boolean active,
        Boolean verified,
        String createdAt,
        String updatedAt) {}
