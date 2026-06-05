package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.category.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getCategories();

    CategoryDto createOrUpdate(CategoryDto category);

    void deleteCate(int cateId);
}
