package com.learnspace.learnspacebackend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record UserUpdateDto(
        @Size(max = 255) String fullName, @Email String email, MultipartFile avatar) {}
