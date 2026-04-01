package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.services.CategoryService;
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
    public String adminCategory(Model model) {
        model.addAttribute("categories", categoryService.getCates());
        model.addAttribute("category", new Category());
        return "admin_categories";
    }

    @PostMapping
    public String add(@ModelAttribute(value = "category") Category category) {
        categoryService.createOrUpdate(category);
        return "redirect:/categories";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable(value = "id") int id) {
        categoryService.deleteCate(id);
        return "redirect:/categories";
    }
}
