package com.piyush.aios.ai_os.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationUrl = "https://ai-personal-os-dv7c.onrender.com/api/auth/verify?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your AI-OS Account");
        message.setText("Welcome to AI Personal OS!\n\n" +
                "Please click the link below to verify your email address and activate your account:\n" +
                verificationUrl + "\n\n" +
                "If you did not register for this account, you can ignore this email.");
        
        mailSender.send(message);
    }
}
