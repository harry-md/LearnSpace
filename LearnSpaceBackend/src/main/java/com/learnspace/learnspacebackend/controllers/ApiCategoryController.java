package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.services.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class ApiCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> list() {
        List<Category> cates = categoryService.getCategories();
        return ResponseEntity.ok(cates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> retrieve(@PathVariable("id") int id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }
}
