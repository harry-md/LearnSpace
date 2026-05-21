package com.learnspace.learnspacebackend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateDto(
        @Size(max = 255, message = "Tên vượt quá độ dài cho phép")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Tên không được chứa ký tự đặc biệt")
        String firstName,

        @Size(max = 255, message = "Họ và tên lót vượt quá độ dài cho phép")
        @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Tên không được chứa ký tự đặc biệt")
        String lastName,

        @Email(message = "Định dạng email không hợp lệ") String email,

        @Size(max = 255, message = "URL avatar vượt quá độ dài cho phép")
        String avatar) {}
