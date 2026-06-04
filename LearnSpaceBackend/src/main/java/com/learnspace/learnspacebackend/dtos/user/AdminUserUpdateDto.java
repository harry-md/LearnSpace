package com.learnspace.learnspacebackend.dtos.user;

import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.*;

import org.springframework.web.multipart.MultipartFile;

public record AdminUserUpdateDto(
        @NotNull Integer id,

        @NotBlank @Size(max = 255) String fullName,

        @NotBlank @Email String email,

        UserRole role,
        Boolean verified,
        MultipartFile avatar) {}
