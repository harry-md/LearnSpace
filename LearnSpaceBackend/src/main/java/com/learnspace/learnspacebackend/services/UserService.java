package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.pojo.User;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User getUserByUsername(String username);

    User register(User u);
}
