package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.service.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class UserController {
    private final UserService userService;

    @GetMapping("/login")
    public String login() {
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

    @GetMapping("/users/delete/{id}")
    public String delete(@PathVariable(value = "id") int id) {
        userService.delete(id);
        return "redirect:/users";
    }
}
