package com.piyush.aios.ai_os.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;


import com.piyush.aios.ai_os.entity.Chat;
import com.piyush.aios.ai_os.entity.ChatRole;
import com.piyush.aios.ai_os.entity.User;
import com.piyush.aios.ai_os.repository.ChatRepository;
import com.piyush.aios.ai_os.security.CurrentUserService;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final CurrentUserService currentUserService;

    public ChatService(
        ChatRepository chatRepository,
        CurrentUserService currentUserService) {

        this.chatRepository = chatRepository;
        this.currentUserService = currentUserService;
    }

    public Chat saveUserMessage(String message) {

        User currentUser = currentUserService.getCurrentUser();

        Chat chat = new Chat();

        chat.setMessage(message);
        chat.setRole(ChatRole.USER);
        chat.setUser(currentUser);

        return chatRepository.save(chat);
    }

    public Chat saveAIMessage(String message) {

        User currentUser = currentUserService.getCurrentUser();

        Chat chat = new Chat();

        chat.setMessage(message);
        chat.setRole(ChatRole.AI);
        chat.setUser(currentUser);

        return chatRepository.save(chat);
    }

    public List<Chat> getChatHistory() {

        User currentUser = currentUserService.getCurrentUser();

        List<Chat> chats = chatRepository.findTop20ByUserOrderByCreatedAtDesc(currentUser);

        Collections.reverse(chats);

        return chats;
    }
}
