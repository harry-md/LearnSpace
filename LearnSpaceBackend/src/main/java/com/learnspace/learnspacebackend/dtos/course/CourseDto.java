package com.learnspace.learnspacebackend.dtos.course;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.learnspace.learnspacebackend.dtos.category.CategoryDto;
import com.learnspace.learnspacebackend.dtos.chapter.ChapterDto;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CourseDto(
        @JsonProperty(access = Access.READ_ONLY) Integer id,

        @NotBlank @Size(max = 255) String name,

        @Size(max = 255) String description,

        @JsonProperty(access = Access.READ_ONLY) String image,

        @JsonProperty(access = Access.READ_ONLY) String introVideo,

        @Digits(integer = 19, fraction = 2) BigDecimal price,

        @JsonProperty(access = Access.WRITE_ONLY) @NotNull Integer categoryId,

        @JsonProperty(access = Access.READ_ONLY) Double avgRating,
        @JsonProperty(access = Access.READ_ONLY) Long enrollmentCount,

        @JsonProperty(access = Access.READ_ONLY) List<ChapterDto> chapters,

        @JsonProperty(access = Access.READ_ONLY) CategoryDto category,
        @JsonProperty(access = Access.READ_ONLY) SimpleUserDto teacher,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        @JsonIgnore MultipartFile imageFile,

        @JsonIgnore MultipartFile introVideoFile) {}
