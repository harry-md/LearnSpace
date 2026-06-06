package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.user.UserLoginDto;
import com.learnspace.learnspacebackend.dto.user.UserProfileDto;
import com.learnspace.learnspacebackend.dto.user.UserRegisterDto;
import com.learnspace.learnspacebackend.dto.user.UserUpdateDto;
import com.learnspace.learnspacebackend.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiUserController {
    private final UserService userService;

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
    public ResponseEntity<UserProfileDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PatchMapping("/current-user")
    public ResponseEntity<UserProfileDto> update(@Valid @ModelAttribute UserUpdateDto dto)
            throws IOException {
        return ResponseEntity.ok(userService.updateUser(dto));
    }
}
