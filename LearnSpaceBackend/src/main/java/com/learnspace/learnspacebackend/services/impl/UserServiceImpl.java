package com.learnspace.learnspacebackend.services.impl;

import com.cloudinary.Cloudinary;
import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.mappers.UserMapper;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.UserService;

import jakarta.persistence.NoResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            User user = userRepository.getUserByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("Không tìm thấy người dùng với username");
            }

            Set<GrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
            if (user.getRole().equals(UserRole.TEACHER) && user.getVerified()) {
                authorities.add(new SimpleGrantedAuthority(UserRole.VERIFIED_TEACHER.name()));
            }
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(), user.getPassword(), authorities);
        } catch (NoResultException ex) {
            throw new UsernameNotFoundException("Không tìm thấy username");
        }
    }

    @Override
    public UserProfileDto getUserByUsername(String username) {
        return userMapper.toProfileDto(userRepository.getUserByUsername(username));
    }

    @Override
    public UserProfileDto register(UserRegisterDto user) {
        return null;
    }
}
