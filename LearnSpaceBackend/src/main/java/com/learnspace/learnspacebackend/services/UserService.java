package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.user.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.user.UserUpdateDto;

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

    UserProfileDto registerAdmin(UserRegisterDto user);

    void updateByAdmin(AdminUserUpdateDto dto) throws IOException;

    void deleteUser(int id);
}
