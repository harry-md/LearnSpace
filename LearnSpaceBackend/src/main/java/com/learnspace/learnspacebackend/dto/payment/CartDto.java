package com.learnspace.learnspacebackend.dto.payment;

import jakarta.validation.constraints.NotNull;

public record CartDto(@NotNull Integer courseId) {}
