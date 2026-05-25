package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.UserUpdateDto;

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
