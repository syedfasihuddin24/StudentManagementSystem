package com.sms.controller;

import com.sms.entity.User;
import com.sms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String token = authService.login(
                    request.get("email"),
                    request.get("password")
            );
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String yearStr = request.get("year");
            Integer year = (yearStr != null && !yearStr.isEmpty()) ? Integer.parseInt(yearStr) : null;

            User user = authService.register(
                    request.get("name"),
                    request.get("email"),
                    request.get("password"),
                    User.Role.valueOf(request.get("role").toUpperCase()),
                    request.get("rollNumber"),
                    request.get("department"),
                    year
            );
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}