package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;
import com.learnspace.learnspacebackend.dto.user.UserProfileDto;
import com.learnspace.learnspacebackend.dto.user.UserRegisterDto;
import com.learnspace.learnspacebackend.entity.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserProfileDto toProfileDto(User user);

    @Mapping(target = "avatar", ignore = true)
    User toEntity(UserRegisterDto dto);

    @Mapping(target = "fullName", expression = "java(teacher.getFullName())")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "avatar", source = "avatar")
    @Mapping(target = "id", source = "id")
    SimpleUserDto toSimpleUserDto(User teacher);
}
