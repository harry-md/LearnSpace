package com.learnspace.learnspacebackend.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.learnspace.learnspacebackend.dtos.AdminUserUpdateDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
    public UserProfileDto register(UserRegisterDto user, MultipartFile avatar) {
        User u = new User();
        u.setUsername(user.username());
        u.setPassword(passwordEncoder.encode(user.password()));
        u.setFirstName(user.firstName());
        u.setLastName(user.lastName());
        u.setEmail(user.email());
        u.setRole(UserRole.STUDENT);

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = cloudinary
                        .uploader()
                        .upload(avatar.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        return userMapper.toProfileDto(userRepository.register(u));
    }

    @Override
    public UserProfileDto registerAdmin(UserRegisterDto user) {
        User u = new User();
        u.setUsername(user.username());
        u.setPassword(passwordEncoder.encode(user.password()));
        u.setFirstName(user.firstName());
        u.setLastName(user.lastName());
        u.setEmail(user.email());
        u.setRole(UserRole.ADMIN);
        return userMapper.toProfileDto(userRepository.register(u));
    }

    @Override
    public List<UserProfileDto> getAllUsers(Map<String, String> params) {
        return userRepository.getAllUsers(params).stream()
                .map(userMapper::toProfileDto)
                .toList();
    }

    @Override
    public void updateByAdmin(AdminUserUpdateDto user, MultipartFile avatar) {
        User u = userRepository.getUserById(user.id());
        if (u == null) {
            throw new RuntimeException("Không tìm thấy User");
        }

        u.setFirstName(user.firstName());
        u.setLastName(user.lastName());
        u.setEmail(user.email());
        u.setRole(user.role());
        u.setActive(user.active() != null ? user.active() : false);

        if (user.role() == UserRole.TEACHER) {
            u.setVerified(user.verified() != null ? user.verified() : false);
        } else {
            u.setVerified(false);
        }

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = cloudinary
                        .uploader()
                        .upload(avatar.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }

        userRepository.update(u);
    }
}
