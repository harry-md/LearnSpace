package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserLoginDto(
        @NotBlank(message = "Tên đăng nhập không được để trống")
        @Pattern(
                regexp = "^[A-Za-z0-9]+$",
                message = "Tên đăng nhập không được chứa ký tự đặc biệt")
        String username,

        @NotBlank(message = "Mật khẩu không được để trống") String password) {}
