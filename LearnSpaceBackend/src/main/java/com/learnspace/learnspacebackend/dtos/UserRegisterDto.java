package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserRegisterDto(
        @NotBlank(message = "Tên đăng nhập không được để trống")
        @Pattern(regexp = "^[A-Za-z]+$", message = "Tên đăng nhập không được chứa ký tự đặc biệt")
        String username,

        @NotBlank(message = "Mật khẩu không được để trống") String password,

        @NotBlank(message = "Tên không được để trống")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Tên không được chứa ký tự đặc biệt")
        String firstName,

        @NotBlank(message = "Họ không được để trống")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Họ không được chứa ký tự đặc biệt")
        String lastName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Định dạng email không hợp lệ")
        String email) {}
