package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.user.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.user.UserUpdateDto;

import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Map;

public interface UserService extends UserDetailsService {
    UserProfileDto getUserByUsername(String username);

    UserProfileDto register(UserRegisterDto dto);

    UserProfileDto updateUser(Integer currentUserId, UserUpdateDto dto);

    String login(UserLoginDto user);

    UserProfileDto registerAdmin(UserRegisterDto user);

    List<UserProfileDto> getAllUsers(Map<String, String> params);

    void updateByAdmin(AdminUserUpdateDto dto);
}
