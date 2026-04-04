package com.learnspace.learnspacebackend.mappers.impl;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.pojo.Course;

import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class CourseMapperImpl implements CourseMapper {
    @Override
    public CourseDto toDto(Course c) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new CourseDto(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getImage(),
                c.getIntroVideo(),
                c.getPrice(),
                c.getActive(),
                c.getCreatedAt().format(formatter),
                c.getUpdatedAt().format(formatter));
    }

    @Override
    public Course toEntity(CourseDto dto) {
        Course c = new Course();
        c.setId(dto.id());
        c.setName(dto.name());
        c.setDescription(dto.description());
        c.setImage(dto.image());
        c.setIntroVideo(dto.introVideo());
        c.setPrice(dto.price());
        c.setActive(dto.active());
        return c;
    }
}
