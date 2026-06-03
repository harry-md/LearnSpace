package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.user.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.user.UserUpdateDto;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserProfileDto getUserByUsername(String username);

    int countAllUsers();

    UserProfileDto register(UserRegisterDto dto);

    UserProfileDto updateUser(Integer currentUserId, UserUpdateDto dto);

    String login(UserLoginDto user);

    UserProfileDto registerAdmin(UserRegisterDto user);

    void updateByAdmin(AdminUserUpdateDto dto);
}
