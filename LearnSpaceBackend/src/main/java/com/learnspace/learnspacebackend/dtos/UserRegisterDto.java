package com.learnspace.learnspacebackend.dtos;

public record UserRegisterDto(
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        String avatar) {}
