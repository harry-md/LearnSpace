package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.review.ReviewDto;
import com.learnspace.learnspacebackend.entity.Review;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toEntity(ReviewDto dto);

    ReviewDto toDto(Review review);
}
