package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAll();

    CategoryDto createOrUpdate(CategoryDto category);

    void delete(int cateId);
}
