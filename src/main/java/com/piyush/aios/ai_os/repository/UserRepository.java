package com.piyush.aios.ai_os.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
