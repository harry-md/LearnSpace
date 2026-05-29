package com.learnspace.learnspacebackend.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserLoginDto(
        @NotBlank(message = "Tên đăng nhập không được để trống")
        @Size(max = 255, message = "Tên đăng nhập vượt quá độ dài cho phép")
        @Pattern(
                regexp = "^[A-Za-z0-9]+$",
                message = "Tên đăng nhập không được chứa ký tự đặc biệt")
        String username,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(max = 255, message = "Mật khẩu vượt quá độ dài cho phép")
        String password) {}
