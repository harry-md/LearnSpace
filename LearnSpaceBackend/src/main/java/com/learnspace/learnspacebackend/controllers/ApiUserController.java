package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.user.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.user.UserUpdateDto;
import com.learnspace.learnspacebackend.services.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiUserController {
    @Autowired
    private UserService userService;

    @PostMapping(
            path = "/users",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserProfileDto> register(
            @Valid @ModelAttribute(value = "data") UserRegisterDto dto) {
        return new ResponseEntity<>(userService.register(dto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginDto user) {
        return ResponseEntity.ok().body(Collections.singletonMap("token", userService.login(user)));
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(userService.getUserByUsername(currentUser.getUsername()));
    }

    @PatchMapping("/current-user")
    public ResponseEntity<UserProfileDto> update(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @ModelAttribute UserUpdateDto dto) {
        return ResponseEntity.ok(userService.updateUser(currentUser.getId(), dto));
    }
}
