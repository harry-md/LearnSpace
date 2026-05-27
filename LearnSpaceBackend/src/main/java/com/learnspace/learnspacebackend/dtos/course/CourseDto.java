package com.learnspace.learnspacebackend.dtos.course;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import com.learnspace.learnspacebackend.dtos.category.CategoryDto;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CourseDto(
        @JsonProperty(access = Access.READ_ONLY) Integer id,

        @NotBlank(message = "Tên khóa học không được để trống")
        @Size(max = 255, message = "Tên khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Tên khóa học không hợp lệ")
        String name,

        @Size(max = 255, message = "Mô tả khóa học vượt quá độ dài cho phép")
        @Pattern(regexp = "^[^<>]*$", message = "Mô tả khóa học không hợp lệ")
        String description,

        @JsonProperty(access = Access.READ_ONLY) String image,

        @JsonProperty(access = Access.READ_ONLY) String introVideo,

        @Digits(integer = 17, fraction = 2, message = "Giá tiền không đúng định dạng")
        BigDecimal price,

        @JsonProperty(access = Access.WRITE_ONLY) Integer categoryId,

        @JsonProperty(access = Access.READ_ONLY) CategoryDto category,
        @JsonProperty(access = Access.READ_ONLY) SimpleUserDto teacher,

        Boolean active,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        @JsonIgnore MultipartFile imageFile,

        @JsonIgnore MultipartFile introVideoFile) {}
