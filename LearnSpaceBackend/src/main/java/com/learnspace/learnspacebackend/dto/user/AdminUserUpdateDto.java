package com.learnspace.learnspacebackend.dto.user;

import com.learnspace.learnspacebackend.entity.UserRole;

import jakarta.validation.constraints.*;

import org.springframework.web.multipart.MultipartFile;

public record AdminUserUpdateDto(
        @NotNull Integer id,

        @NotBlank @Size(max = 255) String fullName,

        @NotBlank @Email String email,

        UserRole role,
        Boolean verified,
        MultipartFile avatar) {}
