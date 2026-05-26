package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.CategoryDto;
import com.learnspace.learnspacebackend.pojo.Category;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);

    Category toEntity(CategoryDto dto);
}
