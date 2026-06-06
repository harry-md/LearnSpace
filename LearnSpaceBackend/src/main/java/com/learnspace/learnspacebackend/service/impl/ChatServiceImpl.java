package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;
import com.learnspace.learnspacebackend.entity.UserRole;
import com.learnspace.learnspacebackend.mapper.UserMapper;
import com.learnspace.learnspacebackend.repository.UserRepository;
import com.learnspace.learnspacebackend.service.ChatService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

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
