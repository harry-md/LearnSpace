package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.dtos.user.UserRegisterDto;
import com.learnspace.learnspacebackend.services.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.Map;

@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @PostMapping("/register")
    public String adminRegister(@Valid @ModelAttribute UserRegisterDto userDto) {
        userService.registerAdmin(userDto);
        return "login";
    }

    @GetMapping("/users")
    public String user(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("users", userService.getAllUsers(params));
        return "admin_user";
    }

    @PostMapping("/users/update")
    public String updateUser(@Valid @ModelAttribute("userDto") AdminUserUpdateDto dto)
            throws IOException {
        userService.updateByAdmin(dto);
        return "redirect:/users";
    }
}
