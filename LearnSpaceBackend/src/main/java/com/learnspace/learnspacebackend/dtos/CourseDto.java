package com.learnspace.learnspacebackend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CourseDto(
        @JsonProperty(access = Access.READ_ONLY) Integer id,

        @NotBlank(message = "Tên khóa học không được để trống")
        @Size(max = 255, message = "Tên khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Tên khóa học không hợp lệ")
        String name,

        @Size(max = 255, message = "Mô tả khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Mô tả khóa học không hợp lệ")
        String description,

        @Size(max = 255, message = "URL hình ảnh vượt quá độ dài cho phép")
        String image,

        @Size(max = 255, message = "URL video giới thiệu vượt quá độ dài cho phép")
        String introVideo,

        @Digits(integer = 17, fraction = 2, message = "Giá tiền không đúng định dạng")
        BigDecimal price,

        Integer categoryId,

        @JsonProperty(access = Access.READ_ONLY) String categoryName,
        @JsonProperty(access = Access.READ_ONLY) String teacherName,

        Boolean active,

        @JsonProperty(access = Access.READ_ONLY) String createdAt,
        @JsonProperty(access = Access.READ_ONLY) String updatedAt) {}
