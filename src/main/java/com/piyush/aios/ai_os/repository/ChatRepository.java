package com.piyush.aios.ai_os.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.piyush.aios.ai_os.entity.Chat;
import com.piyush.aios.ai_os.entity.User;

public interface ChatRepository extends JpaRepository<Chat, Long> {

   List<Chat> findTop20ByUserOrderByCreatedAtDesc(User user);

}