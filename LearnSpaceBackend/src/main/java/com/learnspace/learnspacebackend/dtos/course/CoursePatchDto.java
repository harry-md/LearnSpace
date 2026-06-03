package com.learnspace.learnspacebackend.dtos.course;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public record CoursePatchDto(
        @Size(max = 255) String name,

        @Size(max = 255) String description,

        @Digits(integer = 19, fraction = 2) BigDecimal price,

        Integer categoryId,

        @JsonIgnore MultipartFile imageFile,
        @JsonIgnore MultipartFile introVideoFile) {}
