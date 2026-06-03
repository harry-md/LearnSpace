package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;
import com.learnspace.learnspacebackend.mappers.UserMapper;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.ChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<SimpleUserDto> getContactsEnrolled(int userId) {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
        String role = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList()
                .get(0);

        role = role.replace("ROLE_", "").toLowerCase();

        UserRole userRole = role.equals("verified_teacher") ? UserRole.TEACHER : UserRole.STUDENT;

        return userRepository.getContactsEnrolled(userId, userRole).stream()
                .map(userMapper::toSimpleUserDto)
                .toList();
    }
}
