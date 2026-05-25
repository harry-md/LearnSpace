package com.learnspace.learnspacebackend.dtos;

import com.drew.lang.annotations.NotNull;
import com.learnspace.learnspacebackend.pojo.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

public record AdminUserUpdateDto(
        @NotNull Integer id,

        @NotBlank(message = "Tên không được để trống")
        @Size(max = 255, message = "Tên vượt quá độ dài cho phép")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Tên không được chứa ký tự đặc biệt")
        String firstName,

        @NotBlank(message = "Họ và tên lót không được để trống")
        @Size(max = 255, message = "Họ và tên lót vượt quá độ dài cho phép")
        @Pattern(
                regexp = "^[\\p{L}\\s]+$",
                message = "Họ và tên lót không được chứa ký tự đặc biệt")
        String lastName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Định dạng email không hợp lệ")
        String email,

        UserRole role,
        Boolean active,
        Boolean verified,
        MultipartFile avatar) {}
