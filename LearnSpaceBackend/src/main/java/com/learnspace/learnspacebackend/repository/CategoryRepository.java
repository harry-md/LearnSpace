package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {}
