package com.piyush.aios.ai_os.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.piyush.aios.ai_os.dto.LoginRequest;
import com.piyush.aios.ai_os.dto.LoginResponse;
import com.piyush.aios.ai_os.dto.RegisterRequest;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.exception.InvalidCredentialsException;
import com.piyush.aios.ai_os.exception.UserAlreadyExistsException;
import com.piyush.aios.ai_os.repository.UserRepository;
import com.piyush.aios.ai_os.security.JwtService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService,
                   EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }


    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "User already exists with email: " + request.getEmail());
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setVerified(true);
        user.setVerificationToken(java.util.UUID.randomUUID().toString());

        User savedUser = userRepository.save(user);

        // Send verification email - COMMENTED OUT TEMPORARILY due to SMTP issues
        // try {
        //     emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getVerificationToken());
        // } catch (Exception e) {
        //     userRepository.delete(savedUser); // Rollback user creation
        //     throw new RuntimeException("Email failed to send. Please check MAIL_USERNAME and MAIL_PASSWORD in Render: " + e.getMessage());
        // }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password");
        }

        // if (!user.isVerified()) {
        //     throw new RuntimeException("Please verify your email address before logging in.");
        // }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token, user);
    }

    public User getCurrentUser() {
        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(User updatedUser) {
        User existingUser = getCurrentUser();
        
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getEducation() != null) {
            existingUser.setEducation(updatedUser.getEducation());
        }
        if (updatedUser.getDob() != null) {
            existingUser.setDob(updatedUser.getDob());
        }
        if (updatedUser.getProfilePictureUrl() != null) {
            existingUser.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
        }
        
        return userRepository.save(existingUser);
    }

    public boolean verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));

        if (user.isVerified()) {
            return true; // Already verified
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return true;
    }
}
