package com.learnspace.learnspacebackend.dtos.chapter;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReorderRequest(@NotEmpty List<Integer> orderedIds) {}
