package com.piyush.aios.ai_os.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.piyush.aios.ai_os.dto.ApiResponse;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        User user = userService.getCurrentUser();
        // Clear password before sending
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User updatedUser) {
        User user = userService.updateProfile(updatedUser);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", user));
    }
}
