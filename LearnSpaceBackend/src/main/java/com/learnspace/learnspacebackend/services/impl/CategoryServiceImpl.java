package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;
import com.learnspace.learnspacebackend.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getCates() {
        return categoryRepository.getCates();
    }

    @Override
    public Category getCategotyById(int id) {
        return categoryRepository.getCateById(id);
    }

    @Override
    public Category createOrUpdate(Category category) {
        return categoryRepository.createOrUpdate(category);
    }

    @Override
    public void deleteCate(int id) {
        categoryRepository.deleteCate(id);
    }
}
