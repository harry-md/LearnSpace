package com.learnspace.learnspacebackend.controllers;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dtos.user.UserProfileDto;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.services.ChatService;
import com.learnspace.learnspacebackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ApiChatController {

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    @GetMapping("/token")
    public ResponseEntity<?> getFirebaseToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        UserProfileDto currentUser = userService.getUserByUsername(auth.getName());

        try {
            String firebaseToken = FirebaseAuth.getInstance().createCustomToken(String.valueOf(currentUser.id()));
            Map<String, String> response = new HashMap<>();
            response.put("firebaseToken", firebaseToken);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi tạo token Firebase");
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<?> getChatContacts(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(chatService.getContactsEnrolled(currentUser.getId()));
    }
}
