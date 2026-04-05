package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.pojo.User;

public interface UserMapper {
    UserProfileDto toProfileDto(User user);

    User toEntity(UserRegisterDto dto);
}
