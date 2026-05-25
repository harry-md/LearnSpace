package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.pojo.User;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    // @Mapping(target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    UserProfileDto toProfileDto(User user);

    User toEntity(UserRegisterDto dto);
}
