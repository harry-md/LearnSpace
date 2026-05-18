package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.pojo.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getCates();

    Category getCategotyById(int id);

    Category createOrUpdate(Category category);

    void deleteCate(int id);
}
