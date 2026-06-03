package com.learnspace.learnspacebackend.dtos.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record UserUpdateDto(
        @Size(max = 255, message = "Tên vượt quá độ dài cho phép")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Tên không được chứa ký tự đặc biệt")
        String fullName,

        @Email(message = "Định dạng email không hợp lệ") String email,

        MultipartFile avatar) {}
