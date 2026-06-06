package com.learnspace.learnspacebackend.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.learnspace.learnspacebackend.entity.UserRole;

import java.time.LocalDateTime;

public record UserProfileDto(
        Integer id,
        String username,
        UserRole role,
        String fullName,
        String email,
        String avatar,
        boolean verified,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt) {}
