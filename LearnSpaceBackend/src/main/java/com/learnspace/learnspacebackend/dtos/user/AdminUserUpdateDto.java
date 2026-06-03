package com.learnspace.learnspacebackend.dtos.user;

import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.*;

import org.springframework.web.multipart.MultipartFile;

public record AdminUserUpdateDto(
        @NotNull Integer id,

        @NotBlank(message = "Họ và tên không được để trống")
        @Size(max = 255, message = "Họ và tên vượt quá độ dài cho phép")
        @Pattern(
                regexp = "^[\\p{L}\\s]+$",
                message = "Họ và tên lót không được chứa ký tự đặc biệt")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Định dạng email không hợp lệ")
        String email,

        UserRole role,
        Boolean active,
        Boolean verified,
        MultipartFile avatar) {}
