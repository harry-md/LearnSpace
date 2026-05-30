package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.pojo.User;

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
