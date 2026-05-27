package com.learnspace.learnspacebackend.dtos.payment;

import jakarta.validation.constraints.NotNull;

public record CartDto(@NotNull Integer courseId) {}
