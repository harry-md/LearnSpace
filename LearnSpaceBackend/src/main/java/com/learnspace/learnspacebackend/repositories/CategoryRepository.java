package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Category;

import java.util.List;

public interface CategoryRepository {
    List<Category> getCates();

    Category getCateById(int id);

    Category createOrUpdate(Category category);
}
