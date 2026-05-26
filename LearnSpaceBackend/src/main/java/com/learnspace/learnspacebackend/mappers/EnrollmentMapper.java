package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.EnrollmentDto;
import com.learnspace.learnspacebackend.pojo.Enrollment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "courseId", ignore = true)
    @Mapping(target = "status", source = "enrollment.status")
    EnrollmentDto toDto(Enrollment enrollment);

    Enrollment toEntity(EnrollmentDto dto);
}
