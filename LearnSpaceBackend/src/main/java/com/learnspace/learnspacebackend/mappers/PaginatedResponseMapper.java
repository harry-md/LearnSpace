package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

public class PaginatedResponseMapper {

    public static <T> PaginatedResponseDto<T> toPaginatedResponseDto(
            Long count, int currentPage, int pageSize, List<T> results) {
        String next = null, previous = null;

        int totalPages = (int) Math.ceil((double) count / pageSize);
        UriComponentsBuilder builder = ServletUriComponentsBuilder.fromCurrentRequest();

        if (currentPage < totalPages) {
            next = builder.cloneBuilder()
                    .replaceQueryParam("page", currentPage + 1)
                    .toUriString();
        }

        if (currentPage > 1) {
            previous = builder.cloneBuilder()
                    .replaceQueryParam("page", currentPage - 1)
                    .toUriString();
        }
        return new PaginatedResponseDto<>(count, next, previous, results);
    }
}
