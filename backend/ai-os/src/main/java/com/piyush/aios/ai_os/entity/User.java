package com.piyush.aios.ai_os.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String education;

    private String dob;

    @Column(columnDefinition = "TEXT")
    private String profilePictureUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String phone;

    private String location;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isVerified;

    private String verificationToken;
}
