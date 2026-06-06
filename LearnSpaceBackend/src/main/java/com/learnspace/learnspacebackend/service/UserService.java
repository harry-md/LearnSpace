package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dto.user.UserLoginDto;
import com.learnspace.learnspacebackend.dto.user.UserProfileDto;
import com.learnspace.learnspacebackend.dto.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dto.user.UserUpdateDto;

import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface UserService extends UserDetailsService {
    UserProfileDto getUserByUsername(String username);

    int countAllUsers();

    List<UserProfileDto> getAllUsers(Map<String, String> params);

    UserProfileDto register(UserRegisterDto dto);

    UserProfileDto getCurrentUser();

    UserProfileDto updateUser(UserUpdateDto dto) throws IOException;

    String login(UserLoginDto user);

    void updateByAdmin(AdminUserUpdateDto dto) throws IOException;

    void deleteUser(int id);
}
