package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.category.CategoryDto;
import com.learnspace.learnspacebackend.entity.Category;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);

    Category toEntity(CategoryDto dto);
}
