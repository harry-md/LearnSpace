package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.UserLoginDto;
import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.dtos.UserUpdateDto;
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

    @GetMapping("/current-user")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(userService.getUserByUsername(currentUser.getUsername()));
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        UserProfileDto profile = userService.getUserByUsername(currentUser.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginDto user) {
        return ResponseEntity.ok().body(Collections.singletonMap("token", userService.login(user)));
    }

    @PatchMapping("/current-user")
    public ResponseEntity<UserProfileDto> update(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @ModelAttribute UserUpdateDto dto) {
        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(userService.updateUser(currentUser.getId(), dto));
    }
}
