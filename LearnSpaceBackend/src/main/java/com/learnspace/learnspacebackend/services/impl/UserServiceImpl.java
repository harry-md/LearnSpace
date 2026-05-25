package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.exceptions.DuplicateResourceException;
import com.learnspace.learnspacebackend.exceptions.InvalidLoginException;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.UserMapper;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.CloudinaryService;
import com.learnspace.learnspacebackend.services.UserService;
import com.learnspace.learnspacebackend.utils.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    @Lazy
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng với username");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();

        if (user.getRole().equals(UserRole.TEACHER) && user.getVerified()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + UserRole.VERIFIED_TEACHER.name()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }
        return new CustomUserDetails(
                user.getUsername(), user.getPassword(), authorities, user.getId());
    }

    @Override
    public UserProfileDto getUserByUsername(String username) {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng với username");
        }
        return userMapper.toProfileDto(user);
    }

    @Override
    public UserProfileDto register(UserRegisterDto dto) {
        if (userRepository.checkUsernameExist(dto.username())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }

        User user = userMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.STUDENT);

        if (dto.avatar() != null && !dto.avatar().isEmpty()) {
            user.setAvatar(cloudinaryService.uploadImage(dto.avatar()));
        }

        return userMapper.toProfileDto(userRepository.register(user));
    }

    @Override
    public String login(UserLoginDto user) {
        try {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user.username(), user.password());

            Authentication authenticatedToken = authenticationManager.authenticate(authentication);

            CustomUserDetails principal = (CustomUserDetails) authenticatedToken.getPrincipal();

            String authority = principal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_STUDENT")
                    .replace("ROLE_", "");

            return JwtUtils.generateToken(
                    principal.getId(), principal.getUsername(), UserRole.valueOf(authority));
        } catch (AuthenticationException ex) {
            System.err.println(ex.getMessage());
            throw new InvalidLoginException("Tên đăng nhập hoặc mật khẩu không đúng");
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            throw new RuntimeException("Có lỗi khi tạo token");
        }
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
            throw new ResourceNotFoundException("Không tìm thấy user");
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
            cloudinaryService.deleteImage(u.getAvatar());

            u.setAvatar(cloudinaryService.uploadImage(avatar));
        }

        userRepository.update(u);
    }
}
