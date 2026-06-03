package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.category.CategoryDto;
import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.services.CategoryService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public String view(Model model) {
        model.addAttribute("categories", categoryService.getCategories());
        model.addAttribute("category", new Category());
        return "admin_categories";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute(value = "category") CategoryDto categoryDto) {
        categoryService.createOrUpdate(categoryDto);
        return "redirect:/categories";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable(value = "id") int id) {
        categoryService.deleteCate(id);
        return "redirect:/categories";
    }
}
