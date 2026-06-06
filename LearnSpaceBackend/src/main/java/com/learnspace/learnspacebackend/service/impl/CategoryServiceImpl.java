package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;
import com.learnspace.learnspacebackend.mapper.CategoryMapper;
import com.learnspace.learnspacebackend.repository.CategoryRepository;
import com.learnspace.learnspacebackend.service.CategoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getAll() {
        return categoryRepository.findAll().stream().map(categoryMapper::toDto).toList();
    }

    @Override
    public CategoryDto createOrUpdate(CategoryDto categoryDto) {
        return categoryMapper.toDto(categoryRepository.save(categoryMapper.toEntity(categoryDto)));
    }

    @Override
    public void delete(int cateId) {
        categoryRepository.deleteById(cateId);
    }
}
