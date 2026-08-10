package com.piyush.aios.ai_os.ai;

import java.util.List;
import java.util.Map;

import com.piyush.aios.ai_os.constant.SystemPrompt;
import com.piyush.aios.ai_os.entity.Chat;

import org.springframework.stereotype.Component;

import com.piyush.aios.ai_os.service.ChatService;

@Component
public class PromptBuilder {
    private final ChatService chatService;

    public PromptBuilder(ChatService chatService) {
        this.chatService = chatService;
    }

    public List<Map<String, Object>> buildPrompt(String currentPrompt) {

        List<Chat> chats = chatService.getChatHistory();

        return null;
    }
}