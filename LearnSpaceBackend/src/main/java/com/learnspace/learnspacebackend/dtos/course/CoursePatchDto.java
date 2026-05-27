package com.learnspace.learnspacebackend.dtos.course;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public record CoursePatchDto(
        @Size(max = 255, message = "Tên khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Tên khóa học không hợp lệ")
        String name,

        @Size(max = 255, message = "Mô tả khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Mô tả khóa học không hợp lệ")
        String description,

        @Digits(integer = 17, fraction = 2, message = "Giá tiền không đúng định dạng")
        BigDecimal price,

        Integer categoryId,
        Boolean active,

        @JsonIgnore MultipartFile imageFile,
        @JsonIgnore MultipartFile introVideoFile) {}
