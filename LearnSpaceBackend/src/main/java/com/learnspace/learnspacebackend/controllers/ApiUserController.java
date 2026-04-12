package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.UserProfileDto;
import com.learnspace.learnspacebackend.dtos.UserRegisterDto;
import com.learnspace.learnspacebackend.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class ApiUserController {
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileDto> register(
            @RequestPart(value = "data") UserRegisterDto user,
            @RequestPart(value = "avatar") MultipartFile avatar) {
        return new ResponseEntity<>(userService.register(user, avatar), HttpStatus.CREATED);
    }
}
