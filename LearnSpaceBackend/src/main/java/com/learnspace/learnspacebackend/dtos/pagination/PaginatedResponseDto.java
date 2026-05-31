package com.learnspace.learnspacebackend.dtos.pagination;

import java.util.List;

public record PaginatedResponseDto<T>(Long count, String next, String previous, List<T> results) {}
