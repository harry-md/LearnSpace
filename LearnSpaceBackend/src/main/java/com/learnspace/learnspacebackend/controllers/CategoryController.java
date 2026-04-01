package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public String add(@ModelAttribute(value = "category") Category category, Model model) {
        categoryService.createOrUpdate(category);
        return "redirect:/admin/categories";
    }
}
