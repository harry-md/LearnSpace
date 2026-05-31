package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.review.ReviewDto;
import com.learnspace.learnspacebackend.pojo.Review;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class})
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toEntity(ReviewDto dto);

    ReviewDto toDto(Review review);
}
