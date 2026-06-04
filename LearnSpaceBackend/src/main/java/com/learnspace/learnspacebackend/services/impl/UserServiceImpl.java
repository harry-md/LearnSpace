package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.user.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.user.UserUpdateDto;
import com.learnspace.learnspacebackend.mappers.UserMapper;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.CloudinaryService;
import com.learnspace.learnspacebackend.services.UserService;
import com.learnspace.learnspacebackend.utils.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
    private JwtUtils jwtUtils;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Username không thấy");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();

        if (user.getRole() == UserRole.TEACHER && user.getVerified()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + UserRole.VERIFIED_TEACHER.name()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }
        return new CustomUserDetails(
                user.getUsername(), user.getPassword(), authorities, user.getId());
    }

    @Override
    public UserProfileDto getUserByUsername(String username) {
        return userMapper.toProfileDto(userRepository.getUserByUsername(username));
    }

    @Override
    public UserProfileDto register(UserRegisterDto dto) {
        if (userRepository.checkUsernameExist(dto.username())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        User user = userMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.STUDENT);

        if (dto.avatarFile() != null && !dto.avatarFile().isEmpty()) {
            try {
                user.setAvatar(cloudinaryService.uploadImage(dto.avatarFile()));
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
        }

        return userMapper.toProfileDto(userRepository.register(user));
    }

    @Override
    public String login(UserLoginDto user) {
        if (!userRepository.authenticate(user.username(), user.password())) {
            throw new AccessDeniedException("Thông tin đăng nhập sai");
        }
        CustomUserDetails principal = (CustomUserDetails) loadUserByUsername(user.username());

        String authority = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_STUTDENT")
                .replace("ROLE_", "");
        try {
            return jwtUtils.generateToken(
                    principal.getId(), principal.getUsername(), UserRole.valueOf(authority));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Lỗi đăng nhập");
        }
    }

    @Override
    public UserProfileDto registerAdmin(UserRegisterDto dto) {
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.ADMIN);
        return userMapper.toProfileDto(userRepository.register(user));
    }

    private void handleAvatarUpdate(User u, MultipartFile newAvatar) throws IOException {
        if (newAvatar != null && !newAvatar.isEmpty()) {
            if (u.getAvatar() != null) {
                cloudinaryService.deleteImage(u.getAvatar());
            }
            u.setAvatar(cloudinaryService.uploadImage(newAvatar));
        }
    }

    @Override
    public void updateByAdmin(AdminUserUpdateDto dto) throws IOException {
        User user = userRepository.getUserById(dto.id());
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setRole(dto.role());

        if (dto.role() == UserRole.TEACHER) {
            user.setVerified(dto.verified() != null ? dto.verified() : false);
        } else {
            user.setVerified(false);
        }

        handleAvatarUpdate(user, dto.avatar());
        userRepository.update(user);
    }

    @Override
    public UserProfileDto updateUser(Integer currentUserId, UserUpdateDto dto) throws IOException {
        User user = userRepository.getUserById(currentUserId);
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());

        handleAvatarUpdate(user, dto.avatar());

        userRepository.update(user);
        return userMapper.toProfileDto(user);
    }

    @Override
    public int countAllUsers() {
        return userRepository.countAllUser();
    }

    @Override
    public List<UserProfileDto> getAllUsers(Map<String, String> params) {
        return userRepository.getAllUsers(params).stream()
                .map(userMapper::toProfileDto)
                .toList();
    }

    @Override
    public void deleteUser(int id) {
        userRepository.deleteUser(id);
    }
}
