package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getCategories();

    CategoryDto getCategory(int cateId);

    CategoryDto createOrUpdate(CategoryDto category);

    void deleteCate(int cateId);
}
