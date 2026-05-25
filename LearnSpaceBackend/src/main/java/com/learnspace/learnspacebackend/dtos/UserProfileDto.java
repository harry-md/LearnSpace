package com.learnspace.learnspacebackend.dtos;

import com.learnspace.learnspacebackend.pojo.UserRole;

public record UserProfileDto(
        Integer id,
        String username,
        UserRole role,
        String firstName,
        String lastName,
        String email,
        String avatar,
        boolean active,
        boolean verified,
        String createdAt,
        String updatedAt) {}
