package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.category.CategoryDto;
import com.learnspace.learnspacebackend.mappers.CategoryMapper;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;
import com.learnspace.learnspacebackend.services.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getCategories() {
        return categoryRepository.getCates().stream().map(categoryMapper::toDto).toList();
    }

    @Override
    public CategoryDto createOrUpdate(CategoryDto categoryDto) {
        return categoryMapper.toDto(
                categoryRepository.addOrUpdateCate(categoryMapper.toEntity(categoryDto)));
    }

    @Override
    public void deleteCate(int cateId) {
        categoryRepository.deleteCate(cateId);
    }
}
