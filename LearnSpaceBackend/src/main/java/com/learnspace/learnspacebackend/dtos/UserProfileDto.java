package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.learnspace.learnspacebackend.pojo.UserRole;

import java.time.LocalDateTime;

public record UserProfileDto(
        String username,
        UserRole role,
        String firstName,
        String lastName,
        String email,
        String avatar,
        boolean active,
        boolean verified,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt) {}
