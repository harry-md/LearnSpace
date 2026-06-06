package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dto.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dto.user.UserLoginDto;
import com.learnspace.learnspacebackend.dto.user.UserProfileDto;
import com.learnspace.learnspacebackend.dto.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dto.user.UserUpdateDto;
import com.learnspace.learnspacebackend.entity.User;
import com.learnspace.learnspacebackend.entity.UserRole;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.UserMapper;
import com.learnspace.learnspacebackend.repository.UserRepository;
import com.learnspace.learnspacebackend.repository.specifications.UserSpecifications;
import com.learnspace.learnspacebackend.service.CloudinaryService;
import com.learnspace.learnspacebackend.service.UserService;
import com.learnspace.learnspacebackend.util.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Lazy
    private final AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "NOT_FOUND", "Không tìm thấy user " + username));

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
        return userMapper.toProfileDto(userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "NOT_FOUND", "Không tìm thấy user " + username)));
    }

    @Override
    public UserProfileDto register(UserRegisterDto dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new RuntimeException("Username đã tồn tại!");
        }

        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.STUDENT);
        if (dto.avatarFile() != null && !dto.avatarFile().isEmpty()) {
            user.setAvatar(cloudinaryService.uploadImage(dto.avatarFile()));
        }
        return userMapper.toProfileDto(userRepository.save(user));
    }

    @Override
    public String login(UserLoginDto user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.username(), user.password()));

        CustomUserDetails principal = (CustomUserDetails) loadUserByUsername(user.username());
        String authority = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_STUDENT")
                .replace("ROLE_", "");
        try {
            return jwtUtils.generateToken(
                    principal.getId(), principal.getUsername(), UserRole.valueOf(authority));
        } catch (Exception ex) {
            log.error("Lỗi tạo JWT Token: ", ex);
            throw new RuntimeException("Lỗi đăng nhập");
        }
    }

    private void handleAvatarUpdate(User user, MultipartFile newAvatar) {
        if (newAvatar != null && !newAvatar.isEmpty()) {
            if (user.getAvatar() != null) {
                cloudinaryService.deleteImage(user.getAvatar());
            }
            user.setAvatar(cloudinaryService.uploadImage(newAvatar));
        }
    }

    @Override
    public void updateByAdmin(AdminUserUpdateDto dto) {
        User user = userRepository
                .findById(dto.id())
                .orElseThrow(
                        () -> new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy user"));
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setRole(dto.role());

        if (dto.role() == UserRole.TEACHER) {
            user.setVerified(dto.verified() != null ? dto.verified() : false);
        } else {
            user.setVerified(false);
        }

        handleAvatarUpdate(user, dto.avatar());
        userRepository.save(user);
    }

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public UserProfileDto getCurrentUser() {
        return userMapper.toProfileDto(userRepository
                .findByUsername(getPrincipal().getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "NOT_FOUND", "Không tìm thấy user " + getPrincipal().getUsername())));
    }

    @Override
    public UserProfileDto updateUser(UserUpdateDto dto) {
        User user = userRepository
                .findById(getPrincipal().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "NOT_FOUND", "Không tìm thấy user để update"));

        user.setFullName(dto.fullName());
        user.setEmail(dto.email());

        handleAvatarUpdate(user, dto.avatar());

        userRepository.save(user);
        return userMapper.toProfileDto(user);
    }

    @Override
    public long count() {
        return userRepository.count();
    }

    @Override
    public List<UserProfileDto> getAllUsers(Map<String, String> params) {
        return userRepository.findAll(UserSpecifications.filterUsers(params)).stream()
                .map(userMapper::toProfileDto)
                .toList();
    }

    @Override
    public void delete(int userId) {
        userRepository.deleteById(userId);
    }
}
