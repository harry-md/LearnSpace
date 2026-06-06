package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.enrollment.EnrollmentDto;
import com.learnspace.learnspacebackend.entity.Enrollment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "courseId", ignore = true)
    @Mapping(target = "status", source = "enrollment.status")
    EnrollmentDto toDto(Enrollment enrollment);

    Enrollment toEntity(EnrollmentDto dto);
}
