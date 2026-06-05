package com.learnspace.learnspacebackend.dtos.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record UserRegisterDto(
        @NotBlank @Size(max = 255) @Pattern(regexp = "^[A-Za-z0-9]+$")
        String username,

        @NotBlank @Size(max = 255) String password,

        @NotBlank @Size(max = 255) String fullName,

        @JsonProperty(access = Access.READ_ONLY) String avatar,

        @NotBlank @Email String email,

        @JsonProperty(access = Access.WRITE_ONLY) MultipartFile avatarFile) {}
