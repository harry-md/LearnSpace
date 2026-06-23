package com.learnspace.learnspacebackend.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;
import com.learnspace.learnspacebackend.service.ChatService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
public class ApiChatController {
    private final ChatService chatService;

    @GetMapping("/token")
    public ResponseEntity<?> getFirebaseToken(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        try {
            String firebaseToken = FirebaseAuth.getInstance()
                    .createCustomToken(String.valueOf(currentUser.getId()));
            Map<String, String> response = new HashMap<>();
            response.put("firebaseToken", firebaseToken);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi tạo token Firebase");
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<SimpleUserDto>> getChatContacts(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(chatService.getContactsEnrolled(currentUser.getId()));
    }
}
