package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;
import com.learnspace.learnspacebackend.entity.Category;
import com.learnspace.learnspacebackend.service.CategoryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Controller
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public String view(Model model) {
        model.addAttribute("categories", categoryService.getAll());
        model.addAttribute("category", new Category());
        return "admin_categories";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute(value = "category") CategoryDto categoryDto) {
        categoryService.createOrUpdate(categoryDto);
        return "redirect:/categories";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable(value = "id") int id) {
        categoryService.delete(id);
        return "redirect:/categories";
    }
}
