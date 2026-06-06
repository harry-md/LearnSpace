package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getCategories();

    CategoryDto createOrUpdate(CategoryDto category);

    void deleteCate(int cateId);
}
