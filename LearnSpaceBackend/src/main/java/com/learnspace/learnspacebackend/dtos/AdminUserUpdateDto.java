package com.learnspace.learnspacebackend.dtos;

import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.NotNull;

public record AdminUserUpdateDto(
        @NotNull Integer id,
        String firstName,
        String lastName,
        String email,
        UserRole role,
        boolean active,
        boolean verified) {}
