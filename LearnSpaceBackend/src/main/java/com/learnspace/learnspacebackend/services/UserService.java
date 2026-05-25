package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface UserService extends UserDetailsService {

    UserProfileDto getUserByUsername(String username);

    UserProfileDto register(UserRegisterDto user);

    String login(UserLoginDto user);

    UserProfileDto registerAdmin(UserRegisterDto user);

    List<UserProfileDto> getAllUsers(Map<String, String> params);

    void updateByAdmin(AdminUserUpdateDto user, MultipartFile avatar);
}
