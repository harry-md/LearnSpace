package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.user.AdminUserUpdateDto;
import com.learnspace.learnspacebackend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
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
    public String deleteUser(@PathVariable(value = "id") int id) {
        userService.deleteUser(id);
        return "redirect:/users";
    }
}
