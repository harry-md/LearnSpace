package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

public interface UserService extends UserDetailsService {
    UserProfileDto getUserByUsername(String username);

    UserProfileDto register(UserRegisterDto user, MultipartFile avatar);
}
