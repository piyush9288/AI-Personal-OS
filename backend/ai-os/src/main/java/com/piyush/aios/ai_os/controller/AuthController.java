package com.piyush.aios.ai_os.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.ApiResponse;
import com.piyush.aios.ai_os.dto.LoginRequest;
import com.piyush.aios.ai_os.dto.LoginResponse;
import com.piyush.aios.ai_os.dto.RegisterRequest;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.service.UserService;
import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(
            @Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.status(201).body(ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
